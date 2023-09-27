import { useState, useCallback } from "react"
import { ethers } from "ethers"
import { SupportedChainId, chainParameters } from "../../../constants/chain"
import { INFURA_KEY } from "../../../connectors"
import { abiImplementation, abiPublicResolver, abiRegistry } from "../contracts/abi"
import { useNotification } from "../../../hooks/useNotification"
import { TransactionReceipt } from "@ethersproject/providers"
import { GET_ENS_NAMES_QUERY } from "../queries"
import { ensSubgraphClient } from "../../graphql"
import { useWeb3React } from "@web3-react/core"
import { DropdownOption } from "../../../models/dropdown"
import { useEnsContext } from "../context"

// Addresses obtained from:
// https://discuss.ens.domains/t/namewrapper-updates-including-testnet-deployment-addresses/14505
const publicResolvers: { [key in SupportedChainId]?: string } = {
  [SupportedChainId.SEPOLIA]: "0x8FADE66B79cC9f707aB26799354482EB93a5B7dD",
  [SupportedChainId.MAINNET]: "0x231b0ee14048e9dccd1d247744d114a4eb5e8e63",
  [SupportedChainId.GOERLI]: "0xd7a4F6473f32aC2Af804B3686AE8F1932bC35750",
}

const ensRegistry = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e" // ENS: Registry with Fallback (singleton, same address on different chains)
const ensImplementation = "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85" // ENS: Base Registrar Implementation (singleton, same address on different chains)

export const useENS = () => {
  const openNotification = useNotification()
  const { chainId, account } = useWeb3React()
  const { setEnsNameList } = useEnsContext()

  const client = ensSubgraphClient(chainId)
  const [loading, setLoading] = useState(false)
  const [transactionCompleted, setTransactionCompleted] = useState(false)

  const fetchNames = async () => {
    client
      .query(GET_ENS_NAMES_QUERY, { id: account?.toLowerCase() })
      .toPromise()
      .then((result) => {
        const data = result.data
        if (data.account && data.account.wrappedDomains.length) {
          const list: DropdownOption[] = data.account.wrappedDomains.map((ens: { domain: { name: string } }) => {
            return { label: ens.domain.name, value: ens.domain.name }
          })
          setEnsNameList(list)
        }
      })
  }

  const getPublicResolverAddress = useCallback((chainId: SupportedChainId): string | undefined => {
    return publicResolvers[chainId]
  }, [])

  const getTextRecordContentInfura = useCallback(async (ensName: string, textRecordKey: string) => {
    const provider = new ethers.providers.InfuraProvider("mainnet", INFURA_KEY)
    const resolver = await provider.getResolver(ensName)
    return resolver?.getText(textRecordKey)
  }, [])

  const getTextRecordContent = useCallback(
    async (ensName: string, textRecordKey: string, provider?: ethers.providers.BaseProvider) => {
      if (!provider) {
        return getTextRecordContentInfura(ensName, textRecordKey)
      }

      try {
        const resolver = await provider.getResolver(ensName)
        return resolver?.getText(textRecordKey)
      } catch (e) {
        return getTextRecordContentInfura(ensName, textRecordKey)
      }
    },
    [getTextRecordContentInfura],
  )

  const lookupAddress = useCallback(async (provider: ethers.providers.ExternalProvider, address: string) => {
    try {
      const web3Provider = new ethers.providers.Web3Provider(provider)
      return await web3Provider.lookupAddress(address)
    } catch (e) {
      console.log("ENS is not supported on this network")
    }
  }, [])

  const generateTextRecord = useCallback(
    (provider: ethers.providers.ExternalProvider, publicationId: string, ensName: string) => {
      try {
        const web3Provider = new ethers.providers.Web3Provider(provider)
        const contract = new ethers.Contract(ensRegistry, abiPublicResolver, web3Provider)
        const namehash = ethers.utils.namehash(ensName) // Calculate namehash of the ENS name
        return contract.interface.encodeFunctionData("setText", [namehash, "tabula", publicationId])
      } catch (e) {
        console.log("ENS is not supported on this network")
      }
    },
    [],
  )

  const setRecordMulticall = useCallback(
    async (provider: ethers.providers.ExternalProvider, textRecord: string, chainId: SupportedChainId) => {
      const parameters = chainParameters(chainId)
      const URL = parameters ? parameters.blockExplorerUrls[0] : "https://goerli.etherscan.io/tx/"
      setLoading(true)
      const publicResolver = getPublicResolverAddress(chainId)
      if (!publicResolver) {
        openNotification({
          message: "Public resolver not found for the selected chain.",
          variant: "error",
        })
        setLoading(false)
        return
      }

      try {
        const web3Provider = new ethers.providers.Web3Provider(provider)
        const contract = new ethers.Contract(ensRegistry, abiPublicResolver, web3Provider)
        const signer = web3Provider.getSigner()
        const data = contract.interface.encodeFunctionData("multicall", [[textRecord]])

        if (!data) {
          openNotification({
            message: "Failed to encode data for multicall.",
            variant: "error",
          })
          setLoading(false)
          return
        }

        const tx = await signer.sendTransaction({
          to: publicResolver,
          data: data,
        })
        const receipt: TransactionReceipt = await tx.wait()

        openNotification({
          message: "Transaction completed successfully!",
          variant: "success",
          detailsLink: `${URL}tx/${receipt.transactionHash}`,
        })
        setTransactionCompleted(true)
      } catch (e) {
        console.log("error", e)
        setLoading(false)

        openNotification({
          message: "ENS is not supported on this network or an error occurred.",
          variant: "error",
        })
      } finally {
        setLoading(false)
      }
    },
    [getPublicResolverAddress, openNotification],
  )

  const setTextRecord = useCallback(
    async (provider: ethers.providers.BaseProvider, ensName: string, key: string, content: string) => {
      const ensRegistryContract = new ethers.Contract(ensRegistry, abiRegistry, provider)
      const nameHash = ethers.utils.namehash(ensName)
      const ensResolver = await ensRegistryContract.resolver(nameHash)
      const ensResolverContract = new ethers.Contract(ensResolver, abiPublicResolver, provider)
      return ensResolverContract.setText(nameHash, key, content)
    },
    [],
  )

  const checkIfIsOwner = useCallback(async (provider: ethers.providers.Provider, ensName: string, address: string) => {
    const BigNumber = ethers.BigNumber
    const name = ensName.split(".")[0]
    const labelHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(name))
    const tokenId = BigNumber.from(labelHash).toString()
    const ensImplementationContract = new ethers.Contract(ensImplementation, abiImplementation, provider)
    const nftOwner = await ensImplementationContract.ownerOf(tokenId)
    return ethers.utils.getAddress(nftOwner) === ethers.utils.getAddress(address)
  }, [])

  const checkIfIsController = useCallback(
    async (provider: ethers.providers.Provider, ensName: string, address: string) => {
      const ensRegistryContract = new ethers.Contract(ensRegistry, abiRegistry, provider)
      const nameHash = ethers.utils.namehash(ensName)
      const owner = await ensRegistryContract.owner(nameHash)
      return ethers.utils.getAddress(address) === ethers.utils.getAddress(owner)
    },
    [],
  )

  return {
    getTextRecordContent,
    lookupAddress,
    generateTextRecord,
    setRecordMulticall,
    checkIfIsController,
    checkIfIsOwner,
    setTextRecord,
    fetchNames,
    loading,
    transactionCompleted,
  }
}

export default useENS

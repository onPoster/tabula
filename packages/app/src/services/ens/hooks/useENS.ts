import { useState, useCallback } from "react"
import { ethers } from "ethers"
import { SupportedChainId } from "@/constants/chain"
import { abiPublicResolver } from "@/services/ens/contracts/abi"
import { useNotification } from "@/hooks/useNotification"
import { useEnsContext } from "@/services/ens/context"
import { useWeb3ModalAccount } from "@web3modal/ethers5/react"
import { useExecuteTransaction } from "@/hooks/useContract"
import { useWalletContext } from "@/connectors/WalletProvider"

// Addresses obtained from:
// discuss.ens.domains/t/namewrapper-updates-including-testnet-deployment-addresses/14505

const publicResolvers: { [key in SupportedChainId]?: string } = {
  [SupportedChainId.SEPOLIA]: "0x8FADE66B79cC9f707aB26799354482EB93a5B7dD",
  [SupportedChainId.MAINNET]: "0x231b0ee14048e9dccd1d247744d114a4eb5e8e63",
}

const INFURA_NETWORK_ACCESS_KEY = import.meta.env.VITE_APP_INFURA_NETWORK_ACCESS_KEY

if (typeof INFURA_NETWORK_ACCESS_KEY === "undefined") {
  throw new Error(`VITE_APP_INFURA_NETWORK_ACCESS_KEY must be a defined environment variable`)
}

export const useENS = () => {
  const openNotification = useNotification()

  const { chainId } = useWeb3ModalAccount()

  const { ensClientInstance } = useEnsContext()
  const { signer } = useWalletContext()
  const ensContractAddress = publicResolvers[(chainId as SupportedChainId.MAINNET) || SupportedChainId.SEPOLIA]
  const { executeTransaction, status, errorMessage } = useExecuteTransaction(
    signer,
    ensContractAddress as string,
    abiPublicResolver,
    "setText",
  )
  const [txLoading, setTxLoading] = useState(false)

  const getTextRecordContent = async (ensName: string) => {
    if (ensClientInstance) {
      const ensRecords = await ensClientInstance.getTextRecord({ name: ensName, key: "tabula" })
      return ensRecords
    }
  }

  const setTextRecord = useCallback(
    async (ensName: string, publicationId: string) => {
      try {
        setTxLoading(true)
        const namehash = ethers.utils.namehash(ensName)
        const args = [namehash, "tabula", publicationId]
        const result = await executeTransaction(...args)
        if (result.error) {
          console.error(result.message)
        } else {
          openNotification({
            message: "Transaction completed successfully!",
            variant: "success",
            detailsLink: result.transactionUrl,
          })
        }
      } catch (error) {
        console.error(error)
      } finally {
        setTxLoading(false)
      }
    },
    [executeTransaction, openNotification],
  )

  // const setTextRecord = useCallback(
  //   async (
  //     provider: ethers.providers.ExternalProvider,
  //     publicationId: string,
  //     ensName: string,
  //     chainId: SupportedChainId,
  //   ) => {
  //     const parameters = chainParameters(chainId)
  //     const URL = parameters ? parameters.blockExplorerUrls[0] : "https://sepolia.etherscan.io/tx/"
  //     setLoading(true)
  //     const publicResolver = getPublicResolverAddress(chainId)
  //     if (!publicResolver) {
  //       openNotification({
  //         message: "Public resolver not found for the selected chain.",
  //         variant: "error",
  //       })
  //       setLoading(false)
  //       return
  //     }
  //     try {
  //       const web3Provider = new ethers.providers.Web3Provider(provider)
  //       const contract = new ethers.Contract(ensRegistry, abiPublicResolver, web3Provider)
  //       const namehash = ethers.utils.namehash(ensName) // Calculate namehash of the ENS name
  //       const signer = web3Provider.getSigner()
  //       const data = contract.interface.encodeFunctionData("setText", [namehash, "tabula", publicationId])
  //       if (!data) {
  //         openNotification({
  //           message: "Failed to encode data for setText.",
  //           variant: "error",
  //         })
  //         setLoading(false)
  //         return
  //       }
  //       const tx = await signer.sendTransaction({
  //         to: publicResolver,
  //         data: data,
  //       })
  //       const receipt: TransactionReceipt = await tx.wait()

  //       openNotification({
  //         message: "Transaction completed successfully!",
  //         variant: "success",
  //         detailsLink: `${URL}tx/${receipt.transactionHash}`,
  //       })
  //       setTransactionCompleted(true)
  //     } catch (e) {
  //       console.log("error", e)
  //       setLoading(false)

  //       openNotification({
  //         message: "ENS is not supported on this network or an error occurred.",
  //         variant: "error",
  //       })
  //     } finally {
  //       setLoading(false)
  //     }
  //   },
  //   [getPublicResolverAddress, openNotification],
  // )

  return {
    getTextRecordContent,
    setTextRecord,
    txLoading,
    status,
    errorMessage,
  }
}

export default useENS

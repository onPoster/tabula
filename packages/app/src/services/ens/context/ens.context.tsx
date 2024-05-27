import { useEffect, useState } from "react"
import { createGenericContext } from "@/utils/create-generic-context"
import { EnsContextType, EnsProviderProps } from "./ens.types"
import { DropdownOption } from "@/models/dropdown"
import { useWeb3ModalAccount } from "@web3modal/ethers5/react"
import { useWalletContext } from "@/connectors/WalletProvider"
import { createEnsPublicClient } from "@ensdomains/ensjs"
import { mainnet, sepolia } from "viem/chains"
import { http } from "viem"
import { SupportedChainId } from "@/constants/chain"
const [useEnsContext, EnsContextProvider] = createGenericContext<EnsContextType>()

const EnsProvider = ({ children }: EnsProviderProps) => {
  const { isConnected, address, chainId } = useWeb3ModalAccount()
  const { provider } = useWalletContext()
  const [ensName, setEnsName] = useState<string | undefined | null>(undefined)
  const [ensNameList, setEnsNameList] = useState<DropdownOption[]>([])

  const [ensClientInstance, setEnsClientInstance] = useState(
    createEnsPublicClient({
      chain: chainId === SupportedChainId.SEPOLIA ? sepolia : mainnet,
      transport: http(),
    }),
  )

  useEffect(() => {
    setEnsClientInstance((prevInstance) => {
      const currentChain = prevInstance.chain.id
      const targetChain = chainId === SupportedChainId.SEPOLIA ? sepolia : mainnet
      if (currentChain !== targetChain.id) {
        return createEnsPublicClient({
          chain: targetChain,
          transport: http(),
        })
      }
      return prevInstance
    })
  }, [chainId])

  useEffect(() => {
    if (ensClientInstance && provider && isConnected && address) {
      const fetchEnsData = async () => {
        try {
          const ens = await ensClientInstance.getName({ address })
          if (ens) {
            setEnsName(ens.name)
            setEnsNameList([{ label: ens.name, value: ens.name }])
          }
        } catch (error) {
          console.error("fetchEnsData - ", error)
        }
      }
      fetchEnsData()
    }
  }, [address, isConnected, provider, ensClientInstance])

  return (
    <EnsContextProvider
      value={{
        ensName,
        ensClientInstance,
        setEnsName,
        ensNameList,
        setEnsNameList,
      }}
    >
      {children}
    </EnsContextProvider>
  )
}

export { useEnsContext, EnsProvider }

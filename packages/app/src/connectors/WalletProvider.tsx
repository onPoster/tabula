import { createGenericContext } from "@/utils/create-generic-context"

import { ReactNode, useEffect, useState } from "react"
import { ETHERS_CONFIG, getChains, PROJECT_ID } from "@/config/network"
import { createWeb3Modal, useWeb3ModalProvider } from "@web3modal/ethers5/react"
import { ethers } from "ethers"

export type WalletContextType = {
  web3modal: any
  signer: ethers.providers.JsonRpcSigner | null
}

export type WalletProviderProps = {
  children: ReactNode
}

const [useWalletContext, WalletContextProvider] = createGenericContext<WalletContextType>()

const WalletProvider = ({ children }: WalletProviderProps) => {
  const { walletProvider } = useWeb3ModalProvider()
  const web3modal = createWeb3Modal({
    ethersConfig: ETHERS_CONFIG,
    chains: getChains(),
    projectId: PROJECT_ID,
    enableAnalytics: true,
    themeMode: "light",
  })

  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(null)

  useEffect(() => {
    if (walletProvider && !signer) {
      const provider = new ethers.providers.Web3Provider(walletProvider)
      const signer = provider.getSigner()
      setSigner(signer)
    }
  }, [signer, walletProvider])

  return (
    <WalletContextProvider
      value={{
        web3modal,
        signer,
      }}
    >
      {children}
    </WalletContextProvider>
  )
}

export { useWalletContext, WalletProvider }

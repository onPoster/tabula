import { useEffect, useState } from "react"

import { ethers } from "ethers"
import { JsonRpcSigner } from "@ethersproject/providers"
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers5/react"

export const useWallet = () => {
  // const { library, active } = useWeb3React()
  const { walletProvider } = useWeb3ModalProvider()
  const { isConnected } = useWeb3ModalAccount()
  const [signer, setSigner] = useState<JsonRpcSigner>()

  useEffect(() => {
    if (isConnected && !signer) {
      const getSigner = async () => {
        const provider = new ethers.providers.JsonRpcProvider(walletProvider as any)
        const signer = provider.getSigner()
        setSigner(signer)
      }
      getSigner()
    }
  }, [isConnected, signer, walletProvider])

  return { signer }
}

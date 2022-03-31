import { useEffect, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { JsonRpcSigner } from "@ethersproject/providers"

export const useWallet = () => {
  const { library, active } = useWeb3React()
  const [signer, setSigner] = useState<JsonRpcSigner>()

  useEffect(() => {
    if (active && library) {
      setSigner(library.getSigner())
    }
  }, [library, active])

  return { signer }
}

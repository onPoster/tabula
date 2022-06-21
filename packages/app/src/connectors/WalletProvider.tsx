import React, { useEffect, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { injected } from "."
import useLocalStorage from "../hooks/useLocalStorage"

export const WalletProvider: React.FC<any> = ({ children }) => {
  const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React()
  const [loaded, setLoaded] = useState(false)
  const [walletAutoConnect, setWalletAutoConnect] = useLocalStorage<boolean | undefined>("walletAutoConnect", undefined)
  useEffect(() => {
    injected
      .isAuthorized()
      .then((isAuthorized) => {
        setLoaded(true)
        if (isAuthorized && !networkActive && !networkError && walletAutoConnect) {
          activateNetwork(injected)
        }
      })
      .catch(() => {
        setLoaded(true)
      })
  }, [activateNetwork, networkActive, networkError, setWalletAutoConnect, walletAutoConnect])
  if (loaded) {
    return children
  }
  return null
}

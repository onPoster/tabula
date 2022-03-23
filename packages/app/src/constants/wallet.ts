import { AbstractConnector } from "@web3-react/abstract-connector"
import METAMASK_ICON_URL from "../assets/images/metamask.svg"
import WALLET_CONNECT_ICON_URL from "../assets/images/walletConnect.svg"
import COINBASE_ICON_URL from "../assets/images/coinbaseIcon.svg"
import { injected, walletconnect, walletlink } from "../connectors"

interface WalletInfo {
  connector: AbstractConnector
  name: string
  iconURL: string
}

export const SUPPORTED_WALLETS: WalletInfo[] = [
  {
    connector: injected,
    name: "Metamask",
    iconURL: METAMASK_ICON_URL,
  },
  {
    connector: walletconnect,
    name: "Wallet Connect",
    iconURL: WALLET_CONNECT_ICON_URL,
  },
  {
    connector: walletlink,
    name: "Coinbase Wallet",
    iconURL: COINBASE_ICON_URL,
  },
]

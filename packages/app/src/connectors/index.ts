import { InjectedConnector } from "@web3-react/injected-connector"
import { ALL_SUPPORTED_CHAIN_IDS, SupportedChainId } from "../constants/chain"
import { WalletConnectConnector } from "@web3-react/walletconnect-connector"
import { WalletLinkConnector } from "@web3-react/walletlink-connector"
import TABULA_LOGO_URL from "../assets/images/tabula-logo-wordmark.svg"

export const INFURA_NETWORK_ACCESS_KEY = import.meta.env.VITE_APP_INFURA_NETWORK_ACCESS_KEY

if (typeof INFURA_NETWORK_ACCESS_KEY === "undefined") {
  throw new Error(`VITE_APP_INFURA_NETWORK_ACCESS_KEY must be a defined environment variable`)
}

// not used when a wallet is injected (then the wallet's rpc is used)
const NETWORK_URLS: { [key in SupportedChainId]: string } = {
  [SupportedChainId.MAINNET]: `https://mainnet.infura.io/v3/${INFURA_NETWORK_ACCESS_KEY}`,
  [SupportedChainId.GOERLI]: `https://goerli.infura.io/v3/${INFURA_NETWORK_ACCESS_KEY}`,
  [SupportedChainId.SEPOLIA]: `https://sepolia.infura.io/v3/${INFURA_NETWORK_ACCESS_KEY}`,
  [SupportedChainId.GNOSIS_CHAIN]: `https://rpc.gnosischain.com/`,
  [SupportedChainId.POLYGON]: `https://polygon-rpc.com/`,
  [SupportedChainId.ARBITRUM]: `https://arb1.arbitrum.io/rpc/`,
  [SupportedChainId.OPTIMISM]: `https://mainnet.optimism.io/`,
  [SupportedChainId.OPTIMISM_ON_GNOSIS_CHAIN]: `https://optimism.gnosischain.com`,
}

export const injected = new InjectedConnector({
  supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
})

export const walletconnect = new WalletConnectConnector({
  supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
  rpc: NETWORK_URLS,
  qrcode: true,
})

export const walletlink = new WalletLinkConnector({
  url: NETWORK_URLS[SupportedChainId.MAINNET],
  appName: "Tabula",
  appLogoUrl: TABULA_LOGO_URL,
})

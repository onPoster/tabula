import { InjectedConnector } from "@web3-react/injected-connector"
import { WalletLinkConnector } from "@web3-react/walletlink-connector"
import { Web3Provider } from "@ethersproject/providers"

const connector = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
})

const coinbaseWalletConnector = new WalletLinkConnector({
  url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
  appName: "Web3-react Demo",
  supportedChainIds: [1, 3, 4, 5, 42],
})

const getLibrary = (provider: any) => {
  return new Web3Provider(provider)
}

export { connector, coinbaseWalletConnector, getLibrary }

import { defaultConfig } from "@web3modal/ethers5/react"
import { mainnet, gnosis, sepolia, polygon, arbitrum, optimism } from "viem/chains"
import type { Chain } from "@web3modal/scaffold-utils/ethers"

export const PROJECT_ID = import.meta.env.VITE_APP_WALLET_CONNECT_ID

export const CHAINS = [mainnet, gnosis, sepolia, polygon, arbitrum, optimism]

export const getChains = (): Chain[] => {
  return CHAINS.map((chain) => {
    return {
      rpcUrl: chain.rpcUrls.default.http[0],
      explorerUrl: chain.blockExplorers.default.url,
      currency: chain.nativeCurrency.symbol,
      name: chain.name,
      chainId: chain.id,
    }
  })
}
const metadata = {
  name: "Tabula",
  description: "Instant web3 publications for writers, DAOs, and any Ethereum-based account.",
  url: "https://tabula.gg", // origin must match your domain & subdomain
  icons: ["./logo192.png"],
}

export const ETHERS_CONFIG = defaultConfig({
  metadata,
  defaultChainId: 1, // used for the Coinbase SDK
})

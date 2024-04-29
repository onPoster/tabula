import { defaultConfig } from "@web3modal/ethers5/react"
import { mainnet, gnosis, sepolia, polygon, arbitrum, optimism } from "viem/chains"
import type { Chain } from "@web3modal/scaffold-utils/ethers"
export const PROJECT_ID = "6b3a2e6c039729542f51cff2bc96e43f"

const CHAINS = [mainnet, gnosis, sepolia, polygon, arbitrum, optimism]

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
  description: "My Website description",
  url: "https://tabula.gg", // origin must match your domain & subdomain
  icons: ["./logo192.png"],
}

export const ETHERS_CONFIG = defaultConfig({
  metadata,
  defaultChainId: 1, // used for the Coinbase SDK
})

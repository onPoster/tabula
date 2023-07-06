import { AbstractConnector } from "@web3-react/abstract-connector"
import MainnetIcon from "../assets/images/networks/ethereum.png";
import GoerliIcon from "../assets/images/networks/goerli.png";
import GnosisChainIcon from "../assets/images/networks/gnosis-chain.png";
import OptimismIcon from "../assets/images/networks/optimism.png";
import ArbitrumIcon from "../assets/images/networks/arbitrum.png";
import PolygonIcon from "../assets/images/networks/polygon.png";
import OptimismOnGnosisChainIcon from "../assets/images/networks/optimism-on-gnosis-chain.png";

// This is the place to add support for new networks

export enum SupportedChainId {
  MAINNET = 1,
  GNOSIS_CHAIN = 100,
  GOERLI = 5,
  SEPOLIA = 11155111,
  POLYGON = 137,
  ARBITRUM = 42161,
  OPTIMISM = 10,
  OPTIMISM_ON_GNOSIS_CHAIN = 300,
}

export enum SupportedChain {
  MAINNET = "mainnet",
  GNOSIS_CHAIN = "gnosis_chain",
  GOERLI = "goerli",
  SEPOLIA = "sepolia",
  POLYGON = "polygon",
  ARBITRUM = "arbitrum",
  OPTIMISM = "optimism",
  OPTIMISM_ON_GNOSIS_CHAIN = "optimism_on_gnosis_chain",
}

export const SupportedChainIcon = (chainId: number) => {
  switch (chainId) {
  case SupportedChainId.MAINNET: 
    return MainnetIcon
  case SupportedChainId.GNOSIS_CHAIN: 
  return GnosisChainIcon
  case SupportedChainId.GOERLI: 
  return GoerliIcon
  case SupportedChainId.POLYGON: 
    return PolygonIcon
  case SupportedChainId.ARBITRUM: 
    return ArbitrumIcon
  case SupportedChainId.OPTIMISM: 
    return OptimismIcon
  case SupportedChainId.OPTIMISM_ON_GNOSIS_CHAIN: 
    return OptimismOnGnosisChainIcon
  }
}

export const chainIdToChainName = (chainId: number) => {
  switch (chainId) {
    case SupportedChainId.MAINNET:
      return SupportedChain.MAINNET
    case SupportedChainId.GNOSIS_CHAIN:
      return SupportedChain.GNOSIS_CHAIN
    case SupportedChainId.GOERLI:
      return SupportedChain.GOERLI
    case SupportedChainId.SEPOLIA:
      return SupportedChain.SEPOLIA
    case SupportedChainId.POLYGON:
      return SupportedChain.POLYGON
    case SupportedChainId.ARBITRUM:
      return SupportedChain.ARBITRUM
    case SupportedChainId.OPTIMISM:
      return SupportedChain.OPTIMISM
    case SupportedChainId.OPTIMISM_ON_GNOSIS_CHAIN:
      return SupportedChain.OPTIMISM_ON_GNOSIS_CHAIN
  }
}

export const chainNameToChainId = (chainName?: string) => {
  switch (chainName) {
    case SupportedChain.MAINNET:
      return SupportedChainId.MAINNET
    case SupportedChain.GNOSIS_CHAIN:
      return SupportedChainId.GNOSIS_CHAIN
    case SupportedChain.GOERLI:
      return SupportedChainId.GOERLI
    case SupportedChain.SEPOLIA:
      return SupportedChainId.SEPOLIA
    case SupportedChain.POLYGON:
      return SupportedChainId.POLYGON
    case SupportedChain.ARBITRUM:
      return SupportedChainId.ARBITRUM
    case SupportedChain.OPTIMISM:
      return SupportedChainId.OPTIMISM
    case SupportedChain.OPTIMISM_ON_GNOSIS_CHAIN:
      return SupportedChainId.OPTIMISM_ON_GNOSIS_CHAIN
    default:
      return -1
  }
}

export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = [
  SupportedChainId.MAINNET,
  SupportedChainId.GNOSIS_CHAIN,
  SupportedChainId.GOERLI,
  SupportedChainId.SEPOLIA,
  SupportedChainId.POLYGON,
  SupportedChainId.ARBITRUM,
  SupportedChainId.OPTIMISM,
  // SupportedChainId.OPTIMISM_ON_GNOSIS_CHAIN,
]

export const chainToString = (chainId: number) => {
  switch (chainId) {
    case SupportedChainId.MAINNET:
      return `Mainnet (ChainID: ${chainId})`
    case SupportedChainId.GNOSIS_CHAIN:
      return `Gnosis Chain (ChainID: ${chainId})`
    case SupportedChainId.GOERLI:
      return `Goerli (ChainID: ${chainId})`
    case SupportedChainId.SEPOLIA:
      return `Sepolia (ChainID: ${chainId})`
    case SupportedChainId.POLYGON:
      return `Polygon (ChainID: ${chainId})`
    case SupportedChainId.ARBITRUM:
      return `Arbitrum (ChainID: ${chainId})`
    case SupportedChainId.OPTIMISM:
      return `Optimism (ChainID: ${chainId})`
    case SupportedChainId.OPTIMISM_ON_GNOSIS_CHAIN:
      return `Optimism on Gnosis Chain (ChainID: ${chainId})`
    default: {
      console.warn(`Missing "chainToString" implementation for ChainID: ${chainId}`)
      return "Unknown chain"
    }
  }
}

export const switchChain = async (connector: AbstractConnector, chainId: number) => {
  const provider = await connector.getProvider()
  const requiredChainIdHex = `0x${chainId.toString(16)}`
  return provider!
    .request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: requiredChainIdHex }],
    })
    .catch((error: any) => {
      if (error.code === 4902) {
        // the user's wallet does not have this network, we will request to add it
        return provider!.request({
          method: "wallet_addEthereumChain",
          params: [chainParameters(chainId)],
        })
      }

      throw error
    })
}

export const chainParameters = (chainId: number) => {
  const requiredChainIdHex = `0x${chainId.toString(16)}`
  switch (chainId) {
    case SupportedChainId.MAINNET:
      return {
        chainId: requiredChainIdHex,
        chainName: "Ethereum Mainnet",
        rpcUrls: [
          "https://rpc.ankr.com/eth",
          "https://cloudflare-eth.com",
          "https://eth-mainnet.gateway.pokt.network/v1/5f3453978e354ab992c4da79",
          "https://main-rpc.linkpool.io/",
          "https://api.mycryptoapi.com/eth",
        ],
        nativeCurrency: {
          name: "ETH",
          symbol: "ETH",
          decimals: 18,
        },
        blockExplorerUrls: ["https://etherscan.io"],
      }
    case SupportedChainId.GNOSIS_CHAIN:
      return {
        chainId: requiredChainIdHex,
        chainName: "Gnosis Chain",
        rpcUrls: ["https://rpc.gnosischain.com"],
        nativeCurrency: {
          name: "xDai",
          symbol: "xDai",
          decimals: 18,
        },
        blockExplorerUrls: ["https://blockscout.com/xdai/mainnet"],
      }
    case SupportedChainId.GOERLI:
      return {
        chainId: requiredChainIdHex,
        chainName: "Goerli",
        rpcUrls: [
          "https://rpc.goerli.mudit.blog",
          "https://rpc.ankr.com/eth_goerli",
          "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        ],
        nativeCurrency: {
          name: "ETH",
          symbol: "ETH",
          decimals: 18,
        },
        blockExplorerUrls: ["https://goerli.etherscan.io/"],
      }
    case SupportedChainId.SEPOLIA:
      return {
        chainId: requiredChainIdHex,
        chainName: "Sepolia",
        rpcUrls: [
          "https://rpc.sepolia.org",
          "https://rpc2.sepolia.org",
          "https://rpc-sepolia.rockx.com"
        ],
        nativeCurrency: {
          name: "ETH",
          symbol: "ETH",
          decimals: 18,
        },
        blockExplorerUrls: ["https://sepolia.etherscan.io/"],
      }
    case SupportedChainId.POLYGON:
      return {
        chainId: requiredChainIdHex,
        chainName: "Polygon",
        rpcUrls: [
          "https://poly-rpc.gateway.pokt.network",
          "https://rpc-mainnet.matic.quiknode.pro",
          "https://rpc-mainnet.matic.network",
          "https://rpc.ankr.com/polygon",
        ],
        nativeCurrency: {
          name: "MATIC",
          symbol: "MATIC",
          decimals: 18,
        },
        blockExplorerUrls: ["https://polygonscan.com/"],
      }
    case SupportedChainId.ARBITRUM:
      return {
        chainId: requiredChainIdHex,
        chainName: "Arbitrum",
        rpcUrls: ["https://rpc.ankr.com/arbitrum", "https://arb1.arbitrum.io/rpc"],
        nativeCurrency: {
          name: "ETH",
          symbol: "ETH",
          decimals: 18,
        },
        blockExplorerUrls: ["https://arbiscan.io/"],
      }
    case SupportedChainId.OPTIMISM:
      return {
        chainId: requiredChainIdHex,
        chainName: "Optimism",
        rpcUrls: [
          "https://mainnet.optimism.io",
          "https://optimism-mainnet.public.blastapi.io",
          "https://rpc.ankr.com/optimism",
        ],
        nativeCurrency: {
          name: "ETH",
          symbol: "ETH",
          decimals: 18,
        },
        blockExplorerUrls: ["https://optimistic.etherscan.io/"],
      }
    // case SupportedChainId.OPTIMISM_ON_GNOSIS_CHAIN:
    //   return {
    //     chainId: requiredChainIdHex,
    //     chainName: "Optimism on Gnosis Chain",
    //     rpcUrls: ["https://optimism.gnosischain.com"],
    //     nativeCurrency: {
    //       name: "xDai",
    //       symbol: "xDai",
    //       decimals: 18,
    //     },
    //     blockExplorerUrls: ["https://blockscout.com/xdai/optimism/"],
    //   }
  }
}

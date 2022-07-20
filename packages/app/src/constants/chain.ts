import { AbstractConnector } from "@web3-react/abstract-connector"

// This is the place to add support for new networks

export enum SupportedChainId {
  MAINNET = 1,
  RINKEBY = 4,
  GNOSIS_CHAIN = 100,
  GOERLI = 420,
  POLYGON = 137,
  ARBITRUM = 42161,
  OPTIMISM = 10,
}

export enum SupportedChain {
  MAINNET = "mainnet",
  RINKEBY = "rinkeby",
  GNOSIS_CHAIN = "gnosis_chain",
  GOERLI = "goerli",
  POLYGON = "polygon",
  ARBITRUM = "arbitrum",
  OPTIMISM = "optimism",
}

export const chainIdToChainName = (chainId: number) => {
  switch (chainId) {
    case SupportedChainId.MAINNET:
      return SupportedChain.MAINNET
    case SupportedChainId.RINKEBY:
      return SupportedChain.RINKEBY
    case SupportedChainId.GNOSIS_CHAIN:
      return SupportedChain.GNOSIS_CHAIN
  }
}

export const chainNameToChainId = (chainName?: string) => {
  switch (chainName) {
    case SupportedChain.MAINNET:
      return SupportedChainId.MAINNET
    case SupportedChain.RINKEBY:
      return SupportedChainId.RINKEBY
    case SupportedChain.GNOSIS_CHAIN:
      return SupportedChainId.GNOSIS_CHAIN
    default:
      return -1
  }
}

export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = [
  SupportedChainId.MAINNET,
  SupportedChainId.RINKEBY,
  SupportedChainId.GNOSIS_CHAIN,
]

export const chainToString = (chainId: number) => {
  switch (chainId) {
    case SupportedChainId.MAINNET:
      return `Mainnet (ChainID: ${chainId})`
    case SupportedChainId.RINKEBY:
      return `Rinkeby (ChainID: ${chainId})`
    case SupportedChainId.GNOSIS_CHAIN:
      return `Gnosis Chain (ChainID: ${chainId})`
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

const chainParameters = (chainId: number) => {
  const requiredChainIdHex = `0x${chainId.toString(16)}`
  switch (chainId) {
    case SupportedChainId.MAINNET:
      return {
        chainId: requiredChainIdHex,
        chainName: "Ethereum Mainnet",
        rpcUrls: [
          "https://cloudflare-eth.com",
          "https://eth-mainnet.gateway.pokt.network/v1/5f3453978e354ab992c4da79",
          "https://main-rpc.linkpool.io/",
          "https://api.mycryptoapi.com/eth",
          "https://rpc.ankr.com/eth",
        ],
        nativeCurrency: {
          name: "ETH",
          symbol: "ETH",
          decimals: 18,
        },
        blockExplorerUrls: ["https://etherscan.io"],
      }
    case SupportedChainId.RINKEBY:
      return {
        chainId: requiredChainIdHex,
        chainName: "Rinkeby Test Network",
        rpcUrls: ["https://rinkeby.infura.io/v3/"],
        nativeCurrency: {
          name: "Rinkeby ETH",
          symbol: "ETH",
          decimals: 18,
        },
        blockExplorerUrls: ["https://rinkeby.etherscan.io"],
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
  }
}

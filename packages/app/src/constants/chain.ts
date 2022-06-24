export enum SupportedChainId {
  MAINNET = 1,
  RINKEBY = 4,
  GNOSIS_CHAIN = 100,
}

export enum SupportedChain {
  MAINNET = "mainnet",
  RINKEBY = "rinkeby",
  GNOSIS_CHAIN = "gnosis_chain",
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

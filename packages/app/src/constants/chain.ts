import { AbstractConnector } from "@web3-react/abstract-connector"

export enum SupportedChainId {
  MAINNET = 1,
  RINKEBY = 4,
  GNOSIS_CHAIN = 100,
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
        // the user's wallet does not have this network
        // return provider!.request({
        //   method: "wallet_addEthereumChain",
        //   params: [{ ...desiredChainIdOrChainParameters, chainId: desiredChainIdHex }],
        // })
        console.log("User's wallet does not have this network")
      }

      throw error
    })
}

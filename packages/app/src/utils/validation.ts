import { SupportedChain, SupportedChainId } from "../constants/chain"

export const checkIsValidChain = (currentChain: number): { network: string; isValid: boolean } => {
  const path = window.location.hash

  const isMainnet = path.includes(SupportedChain.MAINNET)
  const isRinkeby = path.includes(SupportedChain.RINKEBY)
  const isGnosis = path.includes(SupportedChain.GNOSIS_CHAIN)

  if (isMainnet && currentChain === SupportedChainId.MAINNET) {
    return { network: "mainnet", isValid: true }
  }

  if (isMainnet && currentChain !== SupportedChainId.MAINNET) {
    return { network: "mainnet", isValid: false }
  }

  if (isRinkeby && currentChain === SupportedChainId.RINKEBY) {
    return { network: "rinkeby", isValid: true }
  }

  if (isRinkeby && currentChain !== SupportedChainId.RINKEBY) {
    return { network: "rinkeby", isValid: false }
  }

  if (isGnosis && currentChain === SupportedChainId.GNOSIS_CHAIN) {
    return { network: "gnosis chain", isValid: true }
  }

  if (isGnosis && currentChain !== SupportedChainId.GNOSIS_CHAIN) {
    return { network: "gnosis chain", isValid: false }
  }
  
  return { network: "", isValid: false }
}

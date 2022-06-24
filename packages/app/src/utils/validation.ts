import { SupportedChain, SupportedChainId } from "../constants/chain"

export const checkIsValidChain = (currentChain: number): boolean => {
  const path = window.location.hash

  const isMainnet = path.includes(SupportedChain.MAINNET)
  const isRinkeby = path.includes(SupportedChain.RINKEBY)
  const isGnosis = path.includes(SupportedChain.GNOSIS_CHAIN)

  if (isMainnet && currentChain === SupportedChainId.MAINNET) {
    return true
  }

  if (isRinkeby && currentChain === SupportedChainId.RINKEBY) {
    return true
  }

  if (isGnosis && currentChain === SupportedChainId.GNOSIS_CHAIN) {
    return true
  }
  return false
}

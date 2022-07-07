import { chainIdToChainName } from "../constants/chain"

export const checkIsValidChain = (
  currentConnectedChainId: number,
  publicationChainName?: string,
): { network: string; isValid: boolean } => {
  const currentChainName = chainIdToChainName(currentConnectedChainId)
  if (currentChainName == null) {
    // unsupported chain
    return { network: "", isValid: false }
  }

  if (publicationChainName == null) {
    return { network: currentChainName, isValid: true }
  }

  return { network: publicationChainName, isValid: currentChainName === publicationChainName }
}

import { chainIdToChainName } from "../constants/chain"

export const checkIsValidChain = (
  currentConnectedChainId: number,
  publicationChainId?: number,
): { network: string; isValid: boolean } => {
  const currentChainName = chainIdToChainName(currentConnectedChainId)
  if (currentChainName == null) {
    // unsupported chain
    return { network: "", isValid: false }
  }

  if (publicationChainId == null || publicationChainId === 0) {
    return { network: currentChainName, isValid: true }
  }

  const publicationChainName = chainIdToChainName(publicationChainId)
  if (publicationChainName == null) {
    throw new Error("The publication is on an unsupported chain. This should not be possible.")
  }
  return { network: publicationChainName, isValid: currentChainName === publicationChainName }
}

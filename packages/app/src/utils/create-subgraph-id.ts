import { ethers } from "ethers"

export enum Action {
  PUBLICATION = "P",
  ARTICLE = "A",
  PERMISSION = "X",
}
export const generateIdFromTransaction = (
  chainId: number,
  tx: ethers.providers.TransactionReceipt,
  txAction: Action,
) => {
  const { transactionHash, logs } = tx
  const logIndex = logs[0].logIndex
  return `${chainId}-${txAction}-${transactionHash}-${logIndex}`
}

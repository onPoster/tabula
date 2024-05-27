import { useCallback, useState, useMemo } from "react"
import { ContractInterface, ethers } from "ethers"
import { useWeb3ModalAccount } from "@web3modal/ethers5/react"
import { Action, generateIdFromTransaction } from "@/utils/create-subgraph-id"
import { chainParameters } from "@/constants/chain"

export enum TransactionStatus {
  Idle = "Idle",
  Pending = "Pending",
  Success = "Success",
  Indexing = "Indexing",
  Error = " Error",
}

export interface TransactionResult {
  error: boolean
  message?: string
  transaction?: ethers.providers.TransactionReceipt
  transactionIdTabulaFormat?: string
  transactionUrl?: string
}

export const useExecuteTransaction = <T,>(
  signer: ethers.Signer | null,
  contractAddress: string,
  abi: ContractInterface,
  methodName: string,
  action?: Action,
) => {
  const { chainId } = useWeb3ModalAccount()
  const parameters = chainId && chainParameters(chainId)
  const URL = parameters ? parameters.blockExplorerUrls[0] : "https://etherscan.io/"
  const [status, setStatus] = useState<TransactionStatus>(TransactionStatus.Idle)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const contract = useMemo(() => {
    if (!contractAddress || contractAddress === "") {
      console.error("Contract address is undefined or empty!")
      return undefined
    }
    return signer ? new ethers.Contract(contractAddress, abi, signer) : undefined
  }, [signer, contractAddress, abi])

  const executeTransaction = useCallback(
    async (...args: T[]): Promise<TransactionResult> => {
      if (!signer || !contract || !chainId) {
        const message = !signer ? "Signer not available" : "Contract is not available"
        return { error: true, message }
      }
      try {
        setStatus(TransactionStatus.Pending)
        const transactionMethod = contract![methodName] as ethers.ContractFunction
        const transactionResponse = await transactionMethod(...args)
        const receipt = await transactionResponse.wait()

        return {
          error: false,
          transaction: receipt,
          transactionIdTabulaFormat: action ? generateIdFromTransaction(chainId, receipt, action) : "",
          transactionUrl: `${URL}tx/${receipt.transactionHash}`,
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        setStatus(TransactionStatus.Error)
        setErrorMessage(errorMessage)
        return { error: true, message: errorMessage }
      }
    },
    [signer, contract, chainId, methodName, action, URL],
  )

  return { executeTransaction, setStatus, status, errorMessage }
}

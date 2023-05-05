import { TransactionReceipt } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useIpfs } from "../../../hooks/useIpfs"
import { useNotification } from "../../../hooks/useNotification"
import { useWallet } from "../../../hooks/useWallet"
import { checkIsValidChain } from "../../../utils/validation"
import { usePosterContext } from "../context"
import { getContract } from "../contracts/contract"
import {
  PosterArticle,
  PosterDeleteArticle,
  PosterDeletePublication,
  PosterPermission,
  PosterUpdateArticle,
  Publication,
} from "../type"
import { chainParameters, SupportedChainId } from "../../../constants/chain"
import usePublication from "../../publications/hooks/usePublication"

const PUBLICATION_TAG = "PUBLICATION"
const POSTER_CONTRACT = process.env.REACT_APP_POSTER_CONTRACT

const usePoster = () => {
  const { publicationSlug } = useParams<{ publicationSlug: string }>()
  const { chainId: publicationChainId } = usePublication(publicationSlug ?? "")
  const openNotification = useNotification()
  const { setTransactionUrl } = usePosterContext()
  const { chainId } = useWeb3React()
  const contract = getContract(POSTER_CONTRACT as string)
  const { signer } = useWallet()
  const [loading, setLoading] = useState<boolean>(false)
  const { pinAction } = useIpfs()
  const [isValidChain, setIsValidChain] = useState<boolean>(false)
  const [properlyNetwork, setProperlyNetwork] = useState<string | null>(null)
  const parameters = chainParameters(chainId ? chainId : SupportedChainId.GOERLI)
  const URL = parameters ? parameters.blockExplorerUrls[0] : "https://goerli.etherscan.io/tx/"

  useEffect(() => {
    if (chainId != null) {
      const validationResult = checkIsValidChain(chainId, publicationChainId)
      setIsValidChain(validationResult.isValid)
      setProperlyNetwork(validationResult.network)
    }
  }, [publicationChainId, chainId])

  const showChainError = useCallback(() => {
    return openNotification({
      message: `Wrong network. Please switch to ${properlyNetwork}.`,
      variant: "error",
      autoHideDuration: 5000,
      preventDuplicate: true,
    })
  }, [openNotification, properlyNetwork])

  const showTransactionError = useCallback(() => {
    return openNotification({
      message: "An error has occurred with your transaction!",
      variant: "error",
      autoHideDuration: 5000,
      preventDuplicate: true,
    })
  }, [openNotification])

  const executeTransaction = useCallback(
    async (content: any): Promise<any> => {
      if (!isValidChain) {
        showChainError()
        return { error: true }
      }

      if (!signer) {
        // Handle case where signer is not available
        return { error: true }
      }

      setLoading(true)
      const poster = contract.connect(signer)
      try {
        console.log("Starting transaction")
        const tx = await poster.post(JSON.stringify(content), PUBLICATION_TAG)
        const receipt: TransactionReceipt = await tx.wait()
        console.log("Transaction completed", receipt)
        setLoading(false)
        setTransactionUrl(`${URL}tx/${receipt.transactionHash}`)
        return { error: false, transaction: receipt }
      } catch (error: any) {
        setLoading(false)
        showTransactionError()
        return { error: true, message: error.message }
      }
    },
    [isValidChain, signer, contract, showChainError, setTransactionUrl, URL, showTransactionError],
  )

  const executePublication = useCallback(
    async (fields: Publication): Promise<any> => {
      const content: Publication = {
        action: fields.action,
        title: fields.title,
      }
      if (fields.id) {
        content.id = fields.id
      }
      if (fields.description) {
        content.description = fields.description
      }
      if (fields.tags?.length) {
        content.tags = fields.tags
      }
      if (fields.image) {
        content.image = fields.image
      }
      if (!fields.image) {
        content.image = ""
      }
      const result = await executeTransaction(content)
      if (!result.error && content.image) {
        await pinAction(content.image, `${content.title}-image`)
      }
      return result
    },
    [executeTransaction, pinAction],
  )

  const deletePublication = useCallback(
    async (publication: PosterDeletePublication): Promise<any> => {
      return executeTransaction(publication)
    },
    [executeTransaction],
  )

  const createArticle = useCallback(
    async (fields: PosterArticle, pin: boolean): Promise<any> => {
      const result = await executeTransaction(fields)
      console.log("result", result)
      if (!result.error) {
        if (fields.image) {
          console.log("pin image action")
          await pinAction(fields.image, `${fields.title}-image`, "Successfully image pinned")
        }
        if (pin) {
          console.log("pin article action")
          await pinAction(fields.article, `Article-${fields.title}`, "Successfully article pinned")
        }
      }
      return result
    },
    [executeTransaction, pinAction],
  )

  const updateArticle = useCallback(
    async (fields: PosterUpdateArticle, pin: boolean): Promise<any> => {
      const result = await executeTransaction(fields)
      if (!result.error) {
        if (fields.image) {
          await pinAction(fields.image, `Image-${fields.title}-${fields.lastUpdated}`, "Successfully image pinned")
        }
        if (pin) {
          await pinAction(
            fields.article,
            `Article-${fields.title}-${fields.lastUpdated}`,
            "Successfully pinned article",
          )
        }
      }
      return result
    },
    [executeTransaction, pinAction],
  )

  const deleteArticle = useCallback(
    async (content: PosterDeleteArticle): Promise<any> => {
      return executeTransaction(content)
    },
    [executeTransaction],
  )

  const givePermission = useCallback(
    async (fields: PosterPermission): Promise<any> => {
      return executeTransaction(fields)
    },
    [executeTransaction],
  )

  return {
    executePublication,
    deletePublication,
    createArticle,
    deleteArticle,
    givePermission,
    updateArticle,
    loading,
  }
}
export default usePoster

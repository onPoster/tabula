import { TransactionReceipt } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { useFiles } from "../../../hooks/useFiles"
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

const PUBLICATION_TAG = "PUBLICATION" // PUBLICATION
const POSTER_CONTRACT = process.env.REACT_APP_POSTER_CONTRACT
const URL = "https://rinkeby.etherscan.io/tx/"

const usePoster = () => {
  const openNotification = useNotification()
  const { setTransactionUrl, lastPathWithChainName } = usePosterContext()
  const { chainId } = useWeb3React()
  const contract = getContract(POSTER_CONTRACT as string)
  const { signer } = useWallet()
  const [loading, setLoading] = useState<boolean>(false)
  const { pinAction } = useFiles()
  const { publicationId } = useParams<{ publicationId: string }>()
  const isValidChain = chainId && checkIsValidChain(chainId, publicationId).isValid
  const properlyNetwork = chainId && checkIsValidChain(chainId, publicationId).network

  const showChainError = () => {
    return openNotification({
      message: `Wrong network. Please switch to ${properlyNetwork}.`,
      variant: "error",
      autoHideDuration: 5000,
      preventDuplicate: true,
    })
  }

  const showTransactionError = () => {
    return openNotification({
      message: "An error has occurred with your transaction!",
      variant: "error",
      autoHideDuration: 5000,
      preventDuplicate: true,
    })
  }

  const executePublication = async (fields: Publication): Promise<any> => {
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
    if (isValidChain) {
      if (signer) {
        setLoading(true)
        const poster = contract.connect(signer)
        try {
          const tx = await poster.post(JSON.stringify(content), PUBLICATION_TAG)
          const receipt: TransactionReceipt = await tx.wait()
          content.image && (await pinAction(content.image, `${content.title}-image`))

          setTransactionUrl(URL + receipt.transactionHash)
          setLoading(false)
        } catch (error: any) {
          setLoading(false)
          showTransactionError()
          return { error: true, message: error.message }
        }
      }
    } else {
      showChainError()
      return { error: true }
    }
  }

  const deletePublication = async (publication: PosterDeletePublication): Promise<any> => {
    if (isValidChain) {
      if (signer) {
        setLoading(true)
        const poster = contract.connect(signer)
        try {
          const tx = await poster.post(JSON.stringify(publication), PUBLICATION_TAG)
          const receipt: TransactionReceipt = await tx.wait()
          setTransactionUrl(URL + receipt.transactionHash)

          setLoading(false)
        } catch (error: any) {
          setLoading(false)
          showTransactionError()
          return { error: true, message: error.message }
        }
      }
    } else {
      showChainError()
      return { error: true }
    }
  }

  const createArticle = async (fields: PosterArticle, pin: boolean): Promise<any> => {
    const content: PosterArticle = {
      action: fields.action,
      title: fields.title,
      article: fields.article,
      publicationId: fields.publicationId,
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
    if (fields.authors) {
      content.authors = fields.authors
    }
    if (isValidChain) {
      if (signer) {
        setLoading(true)
        const poster = contract.connect(signer)
        try {
          const tx = await poster.post(JSON.stringify(content), PUBLICATION_TAG)
          const receipt: TransactionReceipt = await tx.wait()
          setLoading(false)
          content.image && (await pinAction(content.image, `${content.title}-image`, "Successfully image pinned"))
          pin && (await pinAction(content.article, `Article-${content.title}`, "Successfully article pinned"))
          setTransactionUrl(URL + receipt.transactionHash)
        } catch (error: any) {
          setLoading(false)
          showTransactionError()
          return { error: true, message: error.message }
        }
      }
    } else {
      showChainError()
      return { error: true }
    }
  }

  const updateArticle = async (fields: PosterUpdateArticle, pin: boolean): Promise<any> => {
    const content: PosterUpdateArticle = {
      action: fields.action,
      title: fields.title,
      article: fields.article,
      id: fields.id,
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
    if (fields.authors) {
      content.authors = fields.authors
    }
    if (isValidChain) {
      if (signer) {
        setLoading(true)
        const poster = contract.connect(signer)
        try {
          const tx = await poster.post(JSON.stringify(content), PUBLICATION_TAG)
          const receipt: TransactionReceipt = await tx.wait()
          setLoading(false)
          content.image &&
            (await pinAction(
              content.image,
              `Image-${content.title}-${content.lastUpdated}`,
              "Successfully image pinned",
            ))
          pin &&
            (await pinAction(
              content.article,
              `Article-${content.title}-${content.lastUpdated}`,
              "Successfully pinned article",
            ))
          setTransactionUrl(URL + receipt.transactionHash)
        } catch (error: any) {
          setLoading(false)
          showTransactionError()
          return { error: true, message: error.message }
        }
      }
    } else {
      showChainError()
      return { error: true }
    }
  }

  const deleteArticle = async (content: PosterDeleteArticle): Promise<any> => {
    if (isValidChain) {
      if (signer) {
        setLoading(true)
        const poster = contract.connect(signer)
        try {
          const tx = await poster.post(JSON.stringify(content), PUBLICATION_TAG)
          const receipt: TransactionReceipt = await tx.wait()
          setLoading(false)
          setTransactionUrl(URL + receipt.transactionHash)
        } catch (error: any) {
          setLoading(false)
          showTransactionError()
          return { error: true, message: error.message }
        }
      }
    } else {
      showChainError()
      return { error: true }
    }
  }

  const givePermission = async (fields: PosterPermission): Promise<any> => {
    if (isValidChain) {
      if (signer) {
        setLoading(true)
        const poster = contract.connect(signer)
        try {
          const tx = await poster.post(JSON.stringify(fields), PUBLICATION_TAG)
          const receipt: TransactionReceipt = await tx.wait()
          setLoading(false)
          setTransactionUrl(URL + receipt.transactionHash)
        } catch (error: any) {
          setLoading(false)
          showTransactionError()
          return { error: true, message: error.message }
        }
      }
    } else {
      showChainError()
      return { error: true }
    }
  }

  return { executePublication, deletePublication, createArticle, deleteArticle, givePermission, updateArticle, loading }
}
export default usePoster

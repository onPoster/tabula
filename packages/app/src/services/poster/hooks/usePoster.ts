import { TransactionReceipt } from "@ethersproject/providers"
import { useState } from "react"
import { useFiles } from "../../../hooks/useFiles"
import { useNotification } from "../../../hooks/useNotification"
import { useWallet } from "../../../hooks/useWallet"
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
  const { setIsIndexing, setTransactionUrl } = usePosterContext()
  const contract = getContract(POSTER_CONTRACT as string)
  const { signer } = useWallet()
  const [loading, setLoading] = useState<boolean>(false)
  const { pinAction } = useFiles()

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

    if (signer) {
      setLoading(true)
      const poster = contract.connect(signer)
      try {
        const tx = await poster.post(JSON.stringify(content), PUBLICATION_TAG)
        const receipt: TransactionReceipt = await tx.wait()
        content.image && (await pinAction(content.image, `${content.title}-image`))
        setIsIndexing(true)
        setTransactionUrl(URL + receipt.transactionHash)
        setLoading(false)
      } catch (error: any) {
        setLoading(false)
        openNotification({
          message: "An error has happened with execute transaction!",
          variant: "error",
          autoHideDuration: 5000,
        })
        return { error: true, message: error.message }
      }
    }
  }

  const deletePublication = async (publication: PosterDeletePublication): Promise<any> => {
    if (signer) {
      setLoading(true)
      const poster = contract.connect(signer)
      try {
        const tx = await poster.post(JSON.stringify(publication), PUBLICATION_TAG)
        const receipt: TransactionReceipt = await tx.wait()
        setTransactionUrl(URL + receipt.transactionHash)
        setIsIndexing(true)
        setLoading(false)
      } catch (error: any) {
        setLoading(false)
        openNotification({
          message: "An error has happened with execute transaction!",
          variant: "error",
          autoHideDuration: 5000,
        })
        return { error: true, message: error.message }
      }
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
        setIsIndexing(true)
      } catch (error: any) {
        setLoading(false)
        openNotification({
          message: "An error has happened with execute transaction!",
          variant: "error",
          autoHideDuration: 5000,
        })
        return { error: true, message: error.message }
      }
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

    if (signer) {
      setLoading(true)
      const poster = contract.connect(signer)
      try {
        const tx = await poster.post(JSON.stringify(content), PUBLICATION_TAG)
        const receipt: TransactionReceipt = await tx.wait()
        setLoading(false)
        content.image &&
          (await pinAction(content.image, `Image-${content.title}-${content.lastUpdated}`, "Successfully image pinned"))
        pin &&
          (await pinAction(
            content.article,
            `Article-${content.title}-${content.lastUpdated}`,
            "Successfully article pinned",
          ))
        setTransactionUrl(URL + receipt.transactionHash)
        setIsIndexing(true)
      } catch (error: any) {
        setLoading(false)
        openNotification({
          message: "An error has happened with execute transaction!",
          variant: "error",
          autoHideDuration: 5000,
        })
        return { error: true, message: error.message }
      }
    }
  }

  const deleteArticle = async (content: PosterDeleteArticle): Promise<any> => {
    if (signer) {
      setLoading(true)
      const poster = contract.connect(signer)
      try {
        const tx = await poster.post(JSON.stringify(content), PUBLICATION_TAG)
        const receipt: TransactionReceipt = await tx.wait()
        setLoading(false)
        setTransactionUrl(URL + receipt.transactionHash)
        setIsIndexing(true)
      } catch (error: any) {
        setLoading(false)
        openNotification({
          message: "An error has happened with execute transaction!",
          variant: "error",
          autoHideDuration: 5000,
        })
        return { error: true, message: error.message }
      }
    }
  }

  const givePermission = async (fields: PosterPermission): Promise<any> => {
    if (signer) {
      setLoading(true)
      const poster = contract.connect(signer)
      try {
        const tx = await poster.post(JSON.stringify(fields), PUBLICATION_TAG)
        const receipt: TransactionReceipt = await tx.wait()
        setLoading(false)
        setTransactionUrl(URL + receipt.transactionHash)
        setIsIndexing(true)
      } catch (error: any) {
        setLoading(false)
        openNotification({
          message: "An error has happened with execute transaction!",
          variant: "error",
          autoHideDuration: 5000,
        })
        return { error: true, message: error.message }
      }
    }
  }

  return { executePublication, deletePublication, createArticle, deleteArticle, givePermission, updateArticle, loading }
}
export default usePoster

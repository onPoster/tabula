import { TransactionReceipt } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { useEffect, useState } from "react"
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
import { useParams } from "react-router-dom"

const PUBLICATION_TAG = "PUBLICATION" // PUBLICATION
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
  const parameters = chainParameters(chainId ? chainId : SupportedChainId.GOERLI)
  const URL = parameters ? parameters.blockExplorerUrls[0] : "https://goerli.etherscan.io/tx/"
  const properlyNetwork = chainId && checkIsValidChain(chainId, publicationChainId).network

  useEffect(() => {
    if (chainId != null) {
      setIsValidChain(checkIsValidChain(chainId, publicationChainId).isValid)
    }
  }, [isValidChain, publicationChainId, chainId])

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

          setTransactionUrl(`${URL}tx/${receipt.transactionHash}`)
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
          setTransactionUrl(`${URL}tx/${receipt.transactionHash}`)

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
          setTransactionUrl(`${URL}tx/${receipt.transactionHash}`)
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
          setTransactionUrl(`${URL}tx/${receipt.transactionHash}`)
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
          setTransactionUrl(`${URL}tx/${receipt.transactionHash}`)
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
          setTransactionUrl(`${URL}tx/${receipt.transactionHash}`)
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

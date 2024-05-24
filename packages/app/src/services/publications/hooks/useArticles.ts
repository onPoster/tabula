import { useCallback, useEffect, useState } from "react"
import { useQuery } from "urql"
import { useNotification } from "@/hooks/useNotification"
import { Article } from "@/models/publication"
import { useArticleContext } from "@/services/publications/contexts"
import { GET_ARTICLES_QUERY, GET_ARTICLE_QUERY } from "@/services/publications/queries"
import { useWalletContext } from "@/connectors/WalletProvider"
import { TransactionResult, useExecuteTransaction } from "@/hooks/useContract"
import { Action } from "@/utils/create-subgraph-id"
import { POSTER_CONTRACT, POSTER_ABI, POSTER_METHOD } from "./usePublications"
import { TransactionType, useMonitorTransaction } from "@/hooks/useMonitorTransaction"
import { useIPFSContext } from "@/services/ipfs/context"
import { ArticleFormSchema, UpdateArticleFormSchema } from "@/schemas/article.schema"
import {
  generateArticleBody,
  generateUpdateArticleBody,
  deleteArticleBody,
} from "@/services/publications/utils/article-method"
import { useNavigate, useParams } from "react-router-dom"

interface TransactionBody extends Object {
  image?: string
  imgHashes?: string[]
}

const useArticles = () => {
  const navigate = useNavigate()
  const openNotification = useNotification()
  const { encodeIpfsHash, remotePin } = useIPFSContext()
  const { saveArticle, setArticles } = useArticleContext()
  const { publicationSlug } = useParams<{ publicationSlug: string }>()
  const [data, setData] = useState<Article[] | undefined>(undefined)
  const { signer } = useWalletContext()
  const [txLoading, setTxLoading] = useState({
    create: false,
    update: false,
    delete: false,
  })
  const [newArticleId, setNewArticleId] = useState<string>()
  const [articleIdToDelete, setArticleIdToDelete] = useState<string>("")
  const [articleIdToUpdate, setArticleIdToUpdate] = useState<string>("")
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)
  const { executeTransaction, status, errorMessage } = useExecuteTransaction(
    signer,
    POSTER_CONTRACT,
    POSTER_ABI,
    POSTER_METHOD,
    Action.ARTICLE,
  )

  const { isIndexed: newArticleIndexed } = useMonitorTransaction(
    GET_ARTICLE_QUERY,
    {
      id: newArticleId,
    },
    "create",
    "article",
  )
  const { isIndexed: articleDeletedIndexed } = useMonitorTransaction(
    GET_ARTICLE_QUERY,
    {
      id: articleIdToDelete,
    },
    "delete",
    "article",
  )

  const { isIndexed: articleUpdateIndexed, queryResult: articleUpdateFields } = useMonitorTransaction(
    GET_ARTICLE_QUERY,
    {
      id: articleIdToUpdate,
    },
    "update",
    "article",
    lastUpdated,
  )

  const [{ data: result, fetching: loading }, executeQuery] = useQuery({
    query: GET_ARTICLES_QUERY,
  })

  const refetch = useCallback(() => executeQuery({ requestPolicy: "network-only" }), [executeQuery])

  useEffect(() => {
    if (result) {
      setData(result.articles)
      setArticles(result.articles)
    } else {
      setData(undefined)
    }
  }, [result, setArticles])

  useEffect(() => {
    if (newArticleIndexed && newArticleId) {
      setTxLoading((prev) => ({ ...prev, create: false }))
      navigate(`/${publicationSlug}/${newArticleId}`)
      refetch()
    }
  }, [navigate, newArticleId, newArticleIndexed, publicationSlug, refetch])

  useEffect(() => {
    if (articleDeletedIndexed && articleIdToDelete) {
      setTxLoading((prev) => ({ ...prev, delete: false }))
      setArticleIdToDelete("")
      refetch()
    }
  }, [articleDeletedIndexed, articleIdToDelete, refetch, setArticles])

  useEffect(() => {
    if (articleUpdateIndexed && articleUpdateFields) {
      const { article } = articleUpdateFields as { article: Article }

      setTxLoading((prev) => ({ ...prev, update: false }))
      setArticleIdToUpdate("")
      setLastUpdated(null)
      navigate(`/${publicationSlug}/${article.id}`)
      saveArticle(article)
    }
  }, [articleUpdateIndexed, articleUpdateFields, saveArticle, navigate, publicationSlug])

  const handleTransaction = async (
    transactionBody: TransactionBody,
    transactionType: TransactionType,
    callback: (result: TransactionResult) => void,
  ) => {
    try {
      setTxLoading({ ...txLoading, [transactionType]: true })
      const result = await executeTransaction(JSON.stringify(transactionBody), "PUBLICATION")

      if (result.transactionIdTabulaFormat && result.transactionUrl) {
        if (transactionBody.imgHashes && transactionType !== "delete") {
          for (let i = 0; i < transactionBody.imgHashes.length; i++) {
            const imgHash = transactionBody.imgHashes[i]
            await remotePin(imgHash, `${result.transactionIdTabulaFormat}-${result.transaction?.blockHash}-${i}`)
          }
        } else if (transactionBody.image && transactionType !== "delete") {
          await remotePin(transactionBody.image, `${result.transactionIdTabulaFormat}-${result.transaction?.blockHash}`)
        }

        openNotification({
          message: "Execute transaction confirmed!",
          autoHideDuration: 5000,
          variant: "success",
          detailsLink: result.transactionUrl,
          preventDuplicate: true,
        })
        callback(result)
      }
    } catch (error) {
      console.error("error", error)
    } finally {
      setTxLoading({ ...txLoading, [transactionType]: false })
    }
  }

  const createNewArticle = async (publicationId: string, fields: ArticleFormSchema) => {
    const body = await generateArticleBody(publicationId, fields, encodeIpfsHash)
    handleTransaction({ ...body.articleBody, imgHashes: body.imgHashes }, "create", (result) => {
      result.transactionIdTabulaFormat && setNewArticleId(result.transactionIdTabulaFormat)
    })
  }

  const updateArticle = async (publicationId: string, fields: UpdateArticleFormSchema) => {
    const body = await generateUpdateArticleBody(publicationId, fields, encodeIpfsHash)
    handleTransaction({ ...body.articleBody, imgHashes: body.imgHashes }, "update", () => {
      setArticleIdToUpdate(fields.id)
      setLastUpdated(parseInt(fields.lastUpdated ?? ""))
    })
  }

  const deleteArticle = async (articleIdToDelete: string) => {
    const body = await deleteArticleBody(articleIdToDelete)
    handleTransaction(body, "delete", () => {
      setArticleIdToDelete(articleIdToDelete)
    })
  }

  return {
    loading,
    data,
    txLoading,
    status,
    errorMessage,
    createNewArticle,
    deleteArticle,
    updateArticle,
    newArticleId,
    refetch,
    executeQuery,
  }
}

export default useArticles

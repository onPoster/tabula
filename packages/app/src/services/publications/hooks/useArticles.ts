import { maxBy } from "lodash"
import { useCallback, useEffect, useState } from "react"
import { useQuery } from "urql"
import { useNotification } from "@/hooks/useNotification"
import { Article, Publication } from "@/models/publication"
import { usePosterContext } from "@/services/poster/context"
import { INITIAL_ARTICLE_VALUE, useArticleContext } from "@/services/publications/contexts"
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

interface TransactionBody extends Object {
  image?: string
  imgHashes?: string[]
}

const useArticles = () => {
  const openNotification = useNotification()
  // const { transactionUrl } = usePosterContext()
  const { encodeIpfsHash, remotePin } = useIPFSContext()
  const { saveArticle } = useArticleContext()
  const [data, setData] = useState<Article[] | undefined>(undefined)
  // const [indexing, setIndexing] = useState<boolean>(false)
  // const [executePollInterval, setExecutePollInterval] = useState<boolean>(false)
  // const [transactionCompleted, setTransactionCompleted] = useState<boolean>(false)
  const { signer } = useWalletContext()
  const [txLoading, setTxLoading] = useState({
    create: false,
    update: false,
    delete: false,
  })
  const [newArticleId, setNewArticleId] = useState<string>()
  const [articleIdToDelete, setArticleIdToDelete] = useState<string>("")
  const [articleIdToUpdate, setArticleIdToUpdate] = useState<string>("")
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
  )

  const [{ data: result, fetching: loading }, executeQuery] = useQuery({
    query: GET_ARTICLES_QUERY,
  })

  const refetch = useCallback(() => executeQuery({ requestPolicy: "network-only" }), [executeQuery])

  useEffect(() => {
    if (result) {
      setData(result.articles)
    } else {
      setData(undefined)
    }
  }, [result])

  useEffect(() => {
    if (newArticleIndexed && newArticleId) {
      setTxLoading((prev) => ({ ...prev, create: false }))
      console.log("newArticleId", newArticleId)
      // navigate(`/${newArticleId}`)
      refetch()
    }
  }, [newArticleId, newArticleIndexed, refetch])

  useEffect(() => {
    if (articleDeletedIndexed && articleIdToDelete) {
      setTxLoading((prev) => ({ ...prev, delete: false }))
      setArticleIdToDelete("")
      // navigate(`/publications`)
      refetch()
    }
  }, [articleDeletedIndexed, articleIdToDelete, refetch])

  useEffect(() => {
    if (articleUpdateIndexed && articleUpdateFields) {
      setTxLoading((prev) => ({ ...prev, update: false }))
      setArticleIdToUpdate("")
      saveArticle(articleUpdateFields as Article)
    }
  }, [articleUpdateIndexed, articleUpdateFields, saveArticle])

  const handleTransaction = async (
    transactionBody: TransactionBody,
    transactionType: TransactionType,
    callback: (result: TransactionResult) => void,
  ) => {
    try {
      console.log("transactionBody", transactionBody)
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
    })
  }

  const deleteArticle = async (articleIdToDelete: string) => {
    const body = await deleteArticleBody(articleIdToDelete)
    handleTransaction(body, "delete", () => {
      setArticleIdToDelete(articleIdToDelete)
    })
  }

  // //Execute poll interval to know the latest publications indexed
  // useEffect(() => {
  //   if (executePollInterval) {
  //     setIndexing(true)
  //     const interval = setInterval(() => {
  //       refetch()
  //     }, 5000)
  //     return () => clearInterval(interval)
  //   } else {
  //     setIndexing(false)
  //   }
  // }, [executePollInterval, refetch])

  // //Execute poll interval to know is the last article created is already indexed
  // useEffect(() => {
  //   if (data && data.length && executePollInterval && draftArticle) {
  //     const recentArticle = maxBy(data, (fetchedArticle) => {
  //       if (fetchedArticle.lastUpdated) {
  //         return parseInt(fetchedArticle.lastUpdated)
  //       }
  //     })
  //     if (recentArticle && recentArticle.title === draftArticle.title) {
  //       setNewArticleId(recentArticle.id)
  //       saveDraftArticle(INITIAL_ARTICLE_VALUE)
  //       saveArticle(recentArticle)
  //       setTransactionCompleted(true)
  //       setIndexing(false)
  //       setExecutePollInterval(false)
  //       openNotification({
  //         message: "Execute transaction confirmed!",
  //         autoHideDuration: 5000,
  //         variant: "success",
  //         detailsLink: transactionUrl,
  //         preventDuplicate: true,
  //       })
  //       return
  //     }
  //   }
  // }, [
  //   loading,
  //   data,
  //   openNotification,
  //   transactionUrl,
  //   executePollInterval,
  //   draftArticle,
  //   saveArticle,
  //   saveDraftArticle,
  // ])

  // //Show toast when transaction is indexing
  // useEffect(() => {
  //   if (indexing && transactionUrl && showToast) {
  //     setShowToast(false)
  //     openNotification({
  //       message: "The transaction is indexing",
  //       autoHideDuration: 2000,
  //       variant: "info",
  //       detailsLink: transactionUrl,
  //       preventDuplicate: true,
  //     })
  //   }
  // }, [indexing, openNotification, showToast, transactionUrl])

  return {
    loading,
    data,
    // indexing,
    // transactionCompleted,
    // setExecutePollInterval,
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

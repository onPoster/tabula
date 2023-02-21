import { maxBy } from "lodash"
import { useCallback, useEffect, useState } from "react"
import { useQuery } from "urql"
import { useNotification } from "../../../hooks/useNotification"
import { Article } from "../../../models/publication"
import { usePosterContext } from "../../poster/context"
import { INITIAL_ARTICLE_VALUE, usePublicationContext } from "../contexts"
import { GET_ARTICLES_QUERY } from "../queries"

const useArticles = () => {
  const openNotification = useNotification()
  const { transactionUrl } = usePosterContext()
  const { draftArticle, saveDraftArticle, saveArticle, setMarkdownArticle } = usePublicationContext()
  const [showToast, setShowToast] = useState<boolean>(true)
  const [data, setData] = useState<Article[] | undefined>(undefined)
  const [indexing, setIndexing] = useState<boolean>(false)
  const [executePollInterval, setExecutePollInterval] = useState<boolean>(false)
  const [transactionCompleted, setTransactionCompleted] = useState<boolean>(false)
  const [newArticleId, setNewArticleId] = useState<string>()
  const [currentTimestamp, setCurrentTimestamp] = useState<number | undefined>(undefined)
  const [articleId, setArticleId] = useState<string | undefined>(undefined)

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

  //Execute poll interval to know the latest publications indexed
  useEffect(() => {
    if (executePollInterval) {
      setIndexing(true)
      const interval = setInterval(() => {
        refetch()
      }, 5000)
      return () => clearInterval(interval)
    } else {
      setIndexing(false)
    }
  }, [executePollInterval, refetch])

  //Execute poll interval to know is the last article created is already indexed
  useEffect(() => {
    if (data && data.length && executePollInterval && draftArticle) {
      const recentArticle = maxBy(data, (fetchedArticle) => {
        if (fetchedArticle.lastUpdated) {
          return parseInt(fetchedArticle.lastUpdated)
        }
      })
      if (recentArticle && recentArticle.title === draftArticle.title) {
        setNewArticleId(recentArticle.id)
        saveDraftArticle(INITIAL_ARTICLE_VALUE)
        saveArticle(recentArticle)
        setTransactionCompleted(true)
        setIndexing(false)
        setExecutePollInterval(false)
        openNotification({
          message: "Execute transaction confirmed!",
          autoHideDuration: 5000,
          variant: "success",
          detailsLink: transactionUrl,
          preventDuplicate: true
        })
        return
      }
    }
  }, [
    loading,
    data,
    openNotification,
    transactionUrl,
    executePollInterval,
    draftArticle,
    saveArticle,
    saveDraftArticle,
  ])

  //Execute poll interval to know is the last article updated is already indexed
  useEffect(() => {
    if (data && data.length && executePollInterval && draftArticle) {
      const recentArticle = maxBy(data, (fetchedArticle) => {
        if (fetchedArticle.lastUpdated) {
          return parseInt(fetchedArticle.lastUpdated)
        }
      })
      if (
        recentArticle &&
        articleId &&
        recentArticle.lastUpdated &&
        currentTimestamp &&
        recentArticle.id === articleId &&
        parseInt(recentArticle.lastUpdated) > currentTimestamp
      ) {
        setNewArticleId(recentArticle.id)
        setMarkdownArticle(draftArticle.article)
        saveDraftArticle(INITIAL_ARTICLE_VALUE)
        saveArticle(recentArticle)
        setTransactionCompleted(true)
        setIndexing(false)
        setExecutePollInterval(false)
        openNotification({
          message: "Execute transaction confirmed!",
          autoHideDuration: 5000,
          variant: "success",
          detailsLink: transactionUrl,
          preventDuplicate: true
        })
        return
      }
    }
  }, [
    loading,
    data,
    openNotification,
    transactionUrl,
    executePollInterval,
    draftArticle,
    saveArticle,
    saveDraftArticle,
    currentTimestamp,
    setMarkdownArticle,
    articleId,
  ])

  //Show toast when transaction is indexing
  useEffect(() => {
    if (indexing && transactionUrl && showToast) {
      setShowToast(false)
      openNotification({
        message: "The transaction is indexing",
        autoHideDuration: 2000,
        variant: "info",
        detailsLink: transactionUrl,
        preventDuplicate: true,
      })
    }
  }, [indexing, openNotification, showToast, transactionUrl])

  return {
    loading,
    data,
    indexing,
    transactionCompleted,
    newArticleId,
    setExecutePollInterval,
    refetch,
    executeQuery,
    setCurrentTimestamp,
    setArticleId,
  }
}

export default useArticles

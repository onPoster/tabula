import { useCallback, useEffect, useState } from "react"
import { useQuery } from "urql"
import { useIpfs } from "../../../hooks/useIpfs"
import { useNotification } from "../../../hooks/useNotification"
import { Article } from "../../../models/publication"
import { usePosterContext } from "../../poster/context"
import { INITIAL_ARTICLE_VALUE, useArticleContext } from "../contexts"
import { GET_ARTICLE_QUERY } from "../queries"

const useArticle = (id: string) => {
  const openNotification = useNotification()
  const { transactionUrl } = usePosterContext()
  const [data, setData] = useState<Article | undefined>(undefined)
  const [imageSrc, setImageSrc] = useState<string>("")
  const ipfs = useIpfs()
  const { draftArticle, saveDraftArticle, saveArticle, setMarkdownArticle } = useArticleContext()
  const [showToast, setShowToast] = useState<boolean>(true)
  const [indexing, setIndexing] = useState<boolean>(false)
  const [executePollInterval, setExecutePollInterval] = useState<boolean>(false)
  const [transactionCompleted, setTransactionCompleted] = useState<boolean>(false)
  const [newArticleId, setNewArticleId] = useState<string>()
  const [currentTimestamp, setCurrentTimestamp] = useState<number | undefined>(undefined)
  const [articleId, setArticleId] = useState<string | undefined>(undefined)

  useEffect(() => {
    const getImageSrc = async () => {
      if (data?.image != null) {
        const src = await ipfs.getImgSrc(data.image)
        setImageSrc(src)
      }
    }
    if (data?.image != null && imageSrc === "") {
      getImageSrc()
    }
  }, [data, ipfs, imageSrc])

  const [{ data: result, fetching: loading }, executeQuery] = useQuery({
    query: GET_ARTICLE_QUERY,
    variables: { id },
  })

  const refetch = useCallback(() => executeQuery({ requestPolicy: "network-only" }), [executeQuery])

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

  //Execute poll interval to know is the last article updated is already indexed
  useEffect(() => {
    if (data && data && executePollInterval && draftArticle) {
      let isNew = false

      if (data && data.lastUpdated && currentTimestamp) {
        isNew = parseInt(data?.lastUpdated) > currentTimestamp
      }
      if (data && articleId && data.lastUpdated && currentTimestamp && data.id === articleId && isNew) {
        setNewArticleId(data.id)
        setMarkdownArticle(draftArticle.article)
        saveDraftArticle(INITIAL_ARTICLE_VALUE)
        saveArticle(data)
        setTransactionCompleted(true)
        setIndexing(false)
        setExecutePollInterval(false)
        openNotification({
          message: "Execute transaction confirmed!",
          autoHideDuration: 5000,
          variant: "success",
          detailsLink: transactionUrl,
          preventDuplicate: true,
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

  useEffect(() => {
    if (result) {
      setData(result.article)
    } else {
      setData(undefined)
    }
  }, [result])

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
    imageSrc,
  }
}

export default useArticle

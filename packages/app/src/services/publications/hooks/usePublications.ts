import { findIndex, maxBy } from "lodash"
import { useCallback, useEffect, useState } from "react"
import { useQuery } from "urql"
import { useNotification } from "../../../hooks/useNotification"
import { Publication } from "../../../models/publication"
import { usePosterContext } from "../../poster/context"
import { usePublicationContext } from "../contexts"
import { GET_PUBLICATIONS_QUERY } from "../queries"

const usePublications = () => {
  const openNotification = useNotification()
  const { savePublications } = usePublicationContext()
  const { transactionUrl } = usePosterContext()
  const [data, setData] = useState<Publication[] | undefined>(undefined)
  const [indexing, setIndexing] = useState<boolean>(false)
  const [executePollInterval, setExecutePollInterval] = useState<boolean>(false)
  const [redirect, setRedirect] = useState<boolean>(false)
  const [lastPublicationId, setLastPublicationId] = useState<string>()
  const [showToast, setShowToast] = useState<boolean>(true)
  const [lasPublicationTitle, setLastPublicationTitle] = useState<string>("")
  const [deletedPublicationId, setDeletedPublicationId] = useState<string>("")

  const [{ data: result, fetching }, executeQuery] = useQuery({
    query: GET_PUBLICATIONS_QUERY,
  })

  const refetch = useCallback(() => executeQuery({ requestPolicy: "network-only" }), [executeQuery])

  useEffect(() => {
    if (result) {
      setData(result.publications)
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

  //Method to know recent publication created
  useEffect(() => {
    if (data && data.length && executePollInterval) {
      const recentPublished = maxBy(data, (publication) => {
        if (publication.lastUpdated) {
          return parseInt(publication.lastUpdated)
        }
      })

      if (recentPublished && recentPublished.title === lasPublicationTitle) {
        savePublications(data)
        openNotification({
          message: "Execute transaction confirmed!",
          autoHideDuration: 5000,
          variant: "success",
          detailsLink: transactionUrl,
          preventDuplicate: true,
        })
        setExecutePollInterval(false)
        setIndexing(false)
        setRedirect(true)
        setLastPublicationId(recentPublished.id)
      }
    }
  }, [savePublications, openNotification, transactionUrl, data, executePollInterval, lasPublicationTitle])

  //Method to know if the deleted publication is already indexed
  useEffect(() => {
    if (data && data.length && deletedPublicationId && executePollInterval) {
      const currentPublication = findIndex(data, { id: deletedPublicationId })
      if (currentPublication === -1) {
        openNotification({
          message: "Execute transaction confirmed!",
          autoHideDuration: 5000,
          variant: "success",
          detailsLink: transactionUrl,
          preventDuplicate: true
        })
        setRedirect(true)
        savePublications(data)
        setExecutePollInterval(false)
        setIndexing(false)
      }
    }
  }, [openNotification, transactionUrl, data, deletedPublicationId, executePollInterval, savePublications])

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
    loading: fetching,
    data,
    indexing,
    redirect,
    lastPublicationId,
    setLastPublicationTitle,
    refetch,
    executeQuery,
    setExecutePollInterval,
    setDeletedPublicationId,
  }
}

export default usePublications

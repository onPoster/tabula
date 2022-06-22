import { find, isEqual } from "lodash"
import { useCallback, useEffect, useState } from "react"
import { useQuery } from "urql"
import { useNotification } from "../../../hooks/useNotification"
import { Permission, publicationIdToChainId, Publications } from "../../../models/publication"
import { usePosterContext } from "../../poster/context"
import { usePublicationContext } from "../contexts"
import { GET_PUBLICATION_QUERY } from "../queries"

const usePublication = (id: string) => {
  const chainId = publicationIdToChainId(id)
  const openNotification = useNotification()
  const { transactionUrl } = usePosterContext()
  const { publication, permission, savePublication } = usePublicationContext()
  const [showToast, setShowToast] = useState<boolean>(true)
  const [data, setData] = useState<Publications | undefined>(undefined)
  const [indexing, setIndexing] = useState<boolean>(false)
  const [executePollInterval, setExecutePollInterval] = useState<boolean>(false)
  const [currentTimestamp, setCurrentTimestamp] = useState<number | undefined>(undefined)
  const [transactionCompleted, setTransactionCompleted] = useState<boolean>(false)
  const [currentUserPermission, setCurrentUserPermission] = useState<Permission[]>([])
  const [accountPermission, setAccountPermission] = useState<string>()
  const [currentArticleId, setCurrentArticleId] = useState<string>()

  const [{ data: result, fetching: loading }, executeQuery] = useQuery({
    query: GET_PUBLICATION_QUERY,
    variables: { id },
  })

  const refetch = useCallback(() => executeQuery({ requestPolicy: "network-only" }), [executeQuery])

  useEffect(() => {
    if (result) {
      setData(result.publication)
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
    }
  }, [executePollInterval, refetch])

  //Method to know update publication is already indexed
  useEffect(() => {
    if (data && executePollInterval && currentTimestamp) {
      if (data.lastUpdated && parseInt(data.lastUpdated) > currentTimestamp) {
        setTransactionCompleted(true)
        savePublication(data)
        setIndexing(false)
        setExecutePollInterval(false)
        openNotification({
          message: "Execute transaction confirmed!",
          autoHideDuration: 5000,
          variant: "success",
          detailsLink: transactionUrl,
        })
      }
    }
  }, [currentTimestamp, data, executePollInterval, loading, openNotification, savePublication, transactionUrl])

  //Method to know if the remove user or update is already indexed
  useEffect(() => {
    const permissions = data && data.permissions
    if (currentUserPermission && permissions && currentUserPermission.length <= permissions.length) {
      if (executePollInterval) {
        const address = permission?.address
        const oldPermission = find(currentUserPermission, { address: address?.toLowerCase() })
        const indexedPermission = find(permissions, { address: address?.toLowerCase() })
        if (oldPermission?.id === indexedPermission?.id) {
          const isIndexed = isEqual(oldPermission, indexedPermission)
          if (!isIndexed) {
            setTransactionCompleted(true)
            savePublication(data)
            setIndexing(false)
            setExecutePollInterval(false)
            openNotification({
              message: "Execute transaction confirmed!",
              autoHideDuration: 5000,
              variant: "success",
              detailsLink: transactionUrl,
            })
          }
          return
        }
      }
      return
    }
  }, [
    currentUserPermission,
    data,
    executePollInterval,
    loading,
    openNotification,
    permission,
    publication,
    savePublication,
    transactionUrl,
  ])

  //Check if the new permission is already indexed
  useEffect(() => {
    const oldPermissions = publication && publication.permissions
    const permissions = data?.permissions || []
    if (permissions && permissions.length > 0 && accountPermission && executePollInterval) {
      const oldPermission = find(oldPermissions, { address: accountPermission?.toLowerCase() })
      const isIndexed = find(permissions, { address: accountPermission.toLowerCase() })
      if (isIndexed && !isEqual(oldPermission, isIndexed)) {
        setTransactionCompleted(true)
        savePublication(data)
        setIndexing(false)
        setExecutePollInterval(false)
        openNotification({
          message: "Execute transaction confirmed!",
          autoHideDuration: 5000,
          variant: "success",
          detailsLink: transactionUrl,
        })
      }
    }
  }, [
    savePublication,
    permission,
    loading,
    publication,
    openNotification,
    transactionUrl,
    data,
    accountPermission,
    executePollInterval,
  ])

  //Check is the deleted article is already indexed
  useEffect(() => {
    if (executePollInterval && data?.articles && currentArticleId) {
      const articleDeleted = find(data.articles, { id: currentArticleId })
      if (!articleDeleted) {
        setTransactionCompleted(true)
        savePublication(data)
        setIndexing(false)
        setExecutePollInterval(false)
        openNotification({
          message: "Execute transaction confirmed!",
          autoHideDuration: 5000,
          variant: "success",
          detailsLink: transactionUrl,
        })
      }
    }
  }, [currentArticleId, data, executePollInterval, loading, openNotification, savePublication, transactionUrl])

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
    chainId,
    indexing,
    transactionCompleted,
    refetch,
    executeQuery,
    setExecutePollInterval,
    setCurrentTimestamp,
    setCurrentUserPermission,
    setAccountPermission,
    setCurrentArticleId,
  }
}

export default usePublication

import { useCallback, useEffect, useState } from "react"
import { useQuery } from "urql"
import { useNotification } from "@/hooks/useNotification"
import { Publication } from "@/models/publication"
import { GET_PUBLICATIONS_QUERY, GET_PUBLICATION_QUERY } from "@/services/publications/queries"
import { PublicationFormSchema } from "@/schemas/publication.schema"
import { useExecuteTransaction } from "@/hooks/useContract"
import { useWalletContext } from "@/connectors/WalletProvider"
import abi from "@/services/poster/contracts/abi"
import { Action } from "@/utils/create-subgraph-id"
import { useMonitorTransaction } from "@/hooks/useMonitorTransaction"
import { useNavigate } from "react-router-dom"

const POSTER_CONTRACT = import.meta.env.VITE_APP_POSTER_CONTRACT
const POSTER_ABI = abi
const POSTER_METHOD = "post"

const usePublications = () => {
  const openNotification = useNotification()
  const navigate = useNavigate()
  // const { savePublications } = usePublicationContext()
  const { signer } = useWalletContext()
  const [data, setData] = useState<Publication[] | undefined>(undefined)
  const [txLoading, setTxLoading] = useState<boolean>(false)
  const { executeTransaction, status, errorMessage } = useExecuteTransaction(
    signer,
    POSTER_CONTRACT,
    POSTER_ABI,
    POSTER_METHOD,
    Action.PUBLICATION,
  )
  const [newPublicationId, setNewPublicationId] = useState<string>("")
  const { isIndexed: newPublicationIndexed } = useMonitorTransaction(GET_PUBLICATION_QUERY, {
    id: newPublicationId,
  })

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

  useEffect(() => {
    if (newPublicationIndexed && newPublicationId) {
      setTxLoading(false)
      navigate(`/${newPublicationId}`)
      refetch()
    }
  }, [navigate, newPublicationId, newPublicationIndexed, refetch])

  const createNewPublication = async (fields: PublicationFormSchema) => {
    try {
      setTxLoading(true)
      const result = await executeTransaction(
        JSON.stringify({
          action: "publication/create",
          title: fields.title,
          description: fields.description,
          tags: fields.tags ?? [],
        }),
        "PUBLICATION",
      )
      if (result.transactionIdTabulaFormat && result.transactionUrl) {
        openNotification({
          message: "Execute transaction confirmed!",
          autoHideDuration: 5000,
          variant: "success",
          detailsLink: result.transactionUrl,
          preventDuplicate: true,
        })
        setNewPublicationId(result.transactionIdTabulaFormat)
      }
    } catch (error) {
      console.error("error", error)
    } finally {
      setTxLoading(false)
    }
  }

  return {
    loading: fetching,
    txLoading,
    data,
    createNewPublication,
    refetch,
    executeQuery,
    status,
    errorMessage,
  }
}

export default usePublications

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

// //Method to know recent publication created
// useEffect(() => {
//   if (data && data.length && executePollInterval) {
//     const recentPublished = maxBy(data, (publication) => {
//       if (publication.lastUpdated) {
//         return parseInt(publication.lastUpdated)
//       }
//     })

//     if (recentPublished && recentPublished.title === lasPublicationTitle) {
//       savePublications(data)
//       openNotification({
//         message: "Execute transaction confirmed!",
//         autoHideDuration: 5000,
//         variant: "success",
//         detailsLink: transactionUrl,
//         preventDuplicate: true,
//       })
//       setExecutePollInterval(false)
//       setIndexing(false)
//       setRedirect(true)
//       setLastPublicationId(recentPublished.id)
//     }
//   }
// }, [savePublications, openNotification, transactionUrl, data, executePollInterval, lasPublicationTitle])

// //Method to know if the deleted publication is already indexed
// useEffect(() => {
//   if (data && data.length && deletedPublicationId && executePollInterval) {
//     const currentPublication = findIndex(data, { id: deletedPublicationId })
//     if (currentPublication === -1) {
//       openNotification({
//         message: "Execute transaction confirmed!",
//         autoHideDuration: 5000,
//         variant: "success",
//         detailsLink: transactionUrl,
//         preventDuplicate: true
//       })
//       setRedirect(true)
//       savePublications(data)
//       setExecutePollInterval(false)
//       setIndexing(false)
//     }
//   }
// }, [openNotification, transactionUrl, data, deletedPublicationId, executePollInterval, savePublications])

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

import { useCallback, useEffect, useState } from "react"
import { useQuery } from "urql"
import { useNotification } from "@/hooks/useNotification"
import { Publication } from "@/models/publication"
import { GET_PUBLICATIONS_QUERY, GET_PUBLICATION_QUERY } from "@/services/publications/queries"
import { PublicationFormSchema, UpdatePublicationFormSchema } from "@/schemas/publication.schema"
import { TransactionResult, useExecuteTransaction } from "@/hooks/useContract"
import { useWalletContext } from "@/connectors/WalletProvider"
import abi from "@/services/poster/contracts/abi"
import { Action } from "@/utils/create-subgraph-id"
import { TransactionType, useMonitorTransaction } from "@/hooks/useMonitorTransaction"
import { useNavigate } from "react-router-dom"
import { useIPFSContext } from "@/services/ipfs/context"
import {
  deletePublicationBody,
  generatePublicationBody,
  generateUpdatePublicationBody,
} from "@/services/publications/utils/publication-methods"
import { usePublicationContext } from "@/services/publications/contexts"

interface TransactionBody extends Object {
  image?: string
}

const POSTER_CONTRACT = import.meta.env.VITE_APP_POSTER_CONTRACT
const POSTER_ABI = abi
const POSTER_METHOD = "post"

const usePublications = () => {
  const openNotification = useNotification()
  const { encodeIpfsHash, remotePin } = useIPFSContext()
  const navigate = useNavigate()
  const { savePublication } = usePublicationContext()
  const { signer } = useWalletContext()
  const [data, setData] = useState<Publication[] | undefined>(undefined)
  const [txLoading, setTxLoading] = useState({
    create: false,
    update: false,
    delete: false,
  })
  const { executeTransaction, status, errorMessage } = useExecuteTransaction(
    signer,
    POSTER_CONTRACT,
    POSTER_ABI,
    POSTER_METHOD,
    Action.PUBLICATION,
  )
  const [newPublicationId, setNewPublicationId] = useState<string>("")
  const [publicationIdToDelete, setPublicationIdToDelete] = useState<string>("")
  const [publicationIdToUpdate, setPublicationIdToUpdate] = useState<string>("")
  const { isIndexed: newPublicationIndexed } = useMonitorTransaction(
    GET_PUBLICATION_QUERY,
    {
      id: newPublicationId,
    },
    "create",
    "publication",
  )
  const { isIndexed: publicationDeletedIndexed } = useMonitorTransaction(
    GET_PUBLICATION_QUERY,
    {
      id: publicationIdToDelete,
    },
    "delete",
    "publication",
  )

  const { isIndexed: publicationUpdateIndexed, queryResult: publicationUpdateFields } = useMonitorTransaction(
    GET_PUBLICATION_QUERY,
    {
      id: publicationIdToUpdate,
    },
    "update",
    "publication",
  )

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
      setTxLoading((prev) => ({ ...prev, create: false }))
      navigate(`/${newPublicationId}`)
      refetch()
    }
  }, [navigate, newPublicationId, newPublicationIndexed, refetch])

  useEffect(() => {
    if (publicationDeletedIndexed && publicationIdToDelete) {
      setTxLoading((prev) => ({ ...prev, delete: false }))
      setPublicationIdToDelete("")
      navigate(`/publications`)
      refetch()
    }
  }, [navigate, publicationDeletedIndexed, publicationIdToDelete, refetch])

  useEffect(() => {
    if (publicationUpdateIndexed && publicationUpdateFields) {
      setTxLoading((prev) => ({ ...prev, update: false }))
      setPublicationIdToUpdate("")
      savePublication(publicationUpdateFields as Publication)
    }
  }, [navigate, publicationUpdateFields, publicationUpdateIndexed, savePublication])

  const handleTransaction = async (
    transactionBody: TransactionBody,
    transactionType: TransactionType,
    callback: (result: TransactionResult) => void,
  ) => {
    try {
      setTxLoading({ ...txLoading, [transactionType]: true })
      const result = await executeTransaction(JSON.stringify(transactionBody), "PUBLICATION")
      if (result.transactionIdTabulaFormat && result.transactionUrl) {
        if (transactionBody.image && transactionType !== "delete") {
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

  const createNewPublication = async (fields: PublicationFormSchema) => {
    const publicationBody = await generatePublicationBody(fields, encodeIpfsHash)
    handleTransaction(publicationBody, "create", (result) => {
      result.transactionIdTabulaFormat && setNewPublicationId(result.transactionIdTabulaFormat)
    })
  }

  const updatePublication = async (fields: UpdatePublicationFormSchema) => {
    const publicationBody = await generateUpdatePublicationBody(fields, encodeIpfsHash)
    handleTransaction(publicationBody, "update", () => {
      setPublicationIdToUpdate(fields.id)
    })
  }

  const deletePublication = async (publicationIdToDelete: string) => {
    const publicationBody = await deletePublicationBody(publicationIdToDelete)
    handleTransaction(publicationBody, "delete", () => {
      setPublicationIdToDelete(publicationIdToDelete)
    })
  }

  return {
    loading: fetching,
    txLoading,
    data,
    status,
    errorMessage,
    createNewPublication,
    deletePublication,
    updatePublication,
    refetch,
    executeQuery,
  }
}

export default usePublications

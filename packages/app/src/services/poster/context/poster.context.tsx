import { useEffect, useState } from "react"
import { useNotification } from "../../../hooks/useNotification"
import { createGenericContext } from "../../../utils/create-generic-context"
import { PosterContextType, PosterProviderProps } from "./poster.types"

const [usePosterContext, PosterContextProvider] = createGenericContext<PosterContextType>()

const PosterProvider = ({ children }: PosterProviderProps) => {
  const openNotification = useNotification()

  const [isIndexingPublication, setIsIndexingPublication] = useState<boolean>(false)
  const [isIndexingDeletePublication, setIsIndexingDeletePublication] = useState<boolean>(false)
  const [isIndexingCreateArticle, setIsIndexingCreateArticle] = useState<boolean>(false)
  const [isIndexingDeleteArticle, setIsIndexingDeleteArticle] = useState<boolean>(false)
  const [isIndexingUpdateArticle, setIsIndexingUpdateArticle] = useState<boolean>(false)
  const [isIndexingGivePermission, setIsIndexingGivePermission] = useState<boolean>(false)
  const [transactionUrl, setTransactionUrl] = useState<string>("")

  useEffect(() => {
    if (
      (isIndexingPublication ||
        isIndexingDeletePublication ||
        isIndexingCreateArticle ||
        isIndexingDeleteArticle ||
        isIndexingGivePermission) &&
      transactionUrl
    ) {
      openNotification({
        message: "The transaction is indexing",
        autoHideDuration: 2000,
        variant: "info",
        detailsLink: transactionUrl,
        preventDuplicate: true,
      })
    }
  }, [
    isIndexingCreateArticle,
    isIndexingDeleteArticle,
    isIndexingDeletePublication,
    isIndexingGivePermission,
    isIndexingPublication,
    openNotification,
    transactionUrl,
  ])

  const clearAllIndexingStates = () => {
    setIsIndexingPublication(false)
    setIsIndexingDeletePublication(false)
    setIsIndexingCreateArticle(false)
    setIsIndexingDeleteArticle(false)
    setIsIndexingUpdateArticle(false)
    setIsIndexingGivePermission(false)
  }

  return (
    <PosterContextProvider
      value={{
        isIndexingPublication,
        isIndexingDeletePublication,
        isIndexingCreateArticle,
        isIndexingDeleteArticle,
        isIndexingUpdateArticle,
        isIndexingGivePermission,
        transactionUrl,
        setIsIndexingPublication,
        setIsIndexingDeletePublication,
        setIsIndexingCreateArticle,
        setIsIndexingDeleteArticle,
        setIsIndexingUpdateArticle,
        setIsIndexingGivePermission,
        clearAllIndexingStates,
        setTransactionUrl,
      }}
    >
      {children}
    </PosterContextProvider>
  )
}

export { usePosterContext, PosterProvider }

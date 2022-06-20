import { useEffect, useState } from "react"
import { useNotification } from "../../../hooks/useNotification"
import { createGenericContext } from "../../../utils/create-generic-context"
import { PosterContextType, PosterProviderProps } from "./poster.types"

const [usePosterContext, PosterContextProvider] = createGenericContext<PosterContextType>()

const PosterProvider = ({ children }: PosterProviderProps) => {
  const openNotification = useNotification()
  const [isIndexing, setIsIndexing] = useState<boolean>(false)
  const [transactionUrl, setTransactionUrl] = useState<string>("")

  useEffect(() => {
    if (isIndexing && transactionUrl) {
      openNotification({
        message: "The transaction is indexing",
        autoHideDuration: 2000,
        variant: "info",
        detailsLink: transactionUrl,
        preventDuplicate: true,
      })
    }
  }, [isIndexing, openNotification, transactionUrl])

  return (
    <PosterContextProvider
      value={{
        isIndexing,
        setIsIndexing,
        transactionUrl,
        setTransactionUrl,
      }}
    >
      {children}
    </PosterContextProvider>
  )
}

export { usePosterContext, PosterProvider }

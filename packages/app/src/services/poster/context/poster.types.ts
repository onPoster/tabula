import { ReactNode } from "react"

export type PosterContextType = {
  transactionUrl: string
  setTransactionUrl: (value: string) => void
  isIndexingPublication: boolean
  isIndexingDeletePublication: boolean
  isIndexingCreateArticle: boolean
  isIndexingDeleteArticle: boolean
  isIndexingUpdateArticle: boolean
  isIndexingGivePermission: boolean
  setIsIndexingPublication: (value: boolean) => void
  setIsIndexingDeletePublication: (value: boolean) => void
  setIsIndexingCreateArticle: (value: boolean) => void
  setIsIndexingDeleteArticle: (value: boolean) => void
  setIsIndexingUpdateArticle: (value: boolean) => void
  setIsIndexingGivePermission: (value: boolean) => void
  clearAllIndexingStates: () => void
}

export type PosterProviderProps = {
  children: ReactNode
}

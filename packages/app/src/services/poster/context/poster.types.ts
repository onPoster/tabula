import { ReactNode } from "react"

export type PosterContextType = {
  isIndexing: boolean
  setIsIndexing: (value: boolean) => void
  transactionUrl: string
  setTransactionUrl: (value: string) => void
}

export type PosterProviderProps = {
  children: ReactNode
}

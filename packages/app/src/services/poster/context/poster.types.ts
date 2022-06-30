import { ReactNode } from "react"

export type PosterContextType = {
  transactionUrl: string
  setTransactionUrl: (value: string) => void
  lastPathWithChainName: string | undefined
  setLastPathWithChainName: (value: string | undefined) => void
}

export type PosterProviderProps = {
  children: ReactNode
}

import { ReactNode } from "react"

export type EnsContextType = {
  ensName: string | undefined | null
  setEnsName: (value: string | undefined | null) => void
}

export type EnsProviderProps = {
  children: ReactNode
}

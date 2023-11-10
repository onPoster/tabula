import { ReactNode } from "react"
import { DropdownOption } from "../../../models/dropdown"

export type EnsContextType = {
  ensName: string | undefined | null
  setEnsName: (value: string | undefined | null) => void
  ensNameList: DropdownOption[]
  setEnsNameList: (value: DropdownOption[]) => void
}

export type EnsProviderProps = {
  children: ReactNode
}

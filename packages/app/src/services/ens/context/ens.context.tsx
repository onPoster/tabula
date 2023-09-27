import { useState } from "react"
import { createGenericContext } from "../../../utils/create-generic-context"
import { EnsContextType, EnsProviderProps } from "./ens.types"
import { DropdownOption } from "../../../models/dropdown"

const [useEnsContext, EnsContextProvider] = createGenericContext<EnsContextType>()

const EnsProvider = ({ children }: EnsProviderProps) => {
  const [ensName, setEnsName] = useState<string | undefined | null>(undefined)
  const [ensNameList, setEnsNameList] = useState<DropdownOption[]>([])

  return (
    <EnsContextProvider
      value={{
        ensName,
        setEnsName,
        ensNameList,
        setEnsNameList,
      }}
    >
      {children}
    </EnsContextProvider>
  )
}

export { useEnsContext, EnsProvider }

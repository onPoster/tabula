import { useState } from "react"
import { createGenericContext } from "../../../utils/create-generic-context"
import { EnsContextType, EnsProviderProps } from "./ens.types"

const [useEnsContext, EnsContextProvider] = createGenericContext<EnsContextType>()

const EnsProvider = ({ children }: EnsProviderProps) => {

  const [ensName, setEnsName] = useState<string | undefined | null>(undefined)

  return (
    <EnsContextProvider
      value={{
        ensName,
        setEnsName
      }}
    >
      {children}
    </EnsContextProvider>
  )
}

export { useEnsContext, EnsProvider }

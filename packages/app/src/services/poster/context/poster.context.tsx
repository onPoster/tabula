import { useState } from "react"
import { createGenericContext } from "../../../utils/create-generic-context"
import { PosterContextType, PosterProviderProps } from "./poster.types"

const [usePosterContext, PosterContextProvider] = createGenericContext<PosterContextType>()

const PosterProvider = ({ children }: PosterProviderProps) => {
  const [transactionUrl, setTransactionUrl] = useState<string>("")
  const [lastPathWithChainName, setLastPathWithChainName] = useState<string | undefined>(undefined)

  return (
    <PosterContextProvider
      value={{
        transactionUrl,
        lastPathWithChainName,
        setLastPathWithChainName,
        setTransactionUrl,
      }}
    >
      {children}
    </PosterContextProvider>
  )
}

export { usePosterContext, PosterProvider }

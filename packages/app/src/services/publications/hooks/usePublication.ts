import { useCallback, useEffect, useState } from "react"
import { useQuery } from "urql"
import { publicationIdToChainId, Publications } from "../../../models/publication"
import { GET_PUBLICATION_QUERY } from "../queries"

const usePublication = (id: string) => {
  const [data, setData] = useState<Publications | undefined>(undefined)
  const [chainId, setChainId] = useState<number | undefined>(undefined)

  const [{ data: result, fetching: loading }, executeQuery] = useQuery({
    query: GET_PUBLICATION_QUERY,
    variables: { id },
  })

  const refetch = useCallback(() => executeQuery({ requestPolicy: "network-only" }), [executeQuery])

  useEffect(() => {
    if (result) {
      setData(result.publication)
      setChainId(publicationIdToChainId(result.publication?.id))
    } else {
      setData(undefined)
      setChainId(undefined)
    }
  }, [result])

  return { loading, data, refetch, executeQuery, chainId }
}

export default usePublication

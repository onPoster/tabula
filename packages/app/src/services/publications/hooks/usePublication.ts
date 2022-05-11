import { useCallback, useEffect, useState } from "react"
import { useQuery } from "urql"
import { publicationIdToChainId, Publications } from "../../../models/publication"
import { GET_PUBLICATION_QUERY } from "../queries"

const usePublication = (id: string) => {
  const [data, setData] = useState<Publications | undefined>(undefined)
  const chainId = publicationIdToChainId(id)

  const [{ data: result, fetching: loading }, executeQuery] = useQuery({
    query: GET_PUBLICATION_QUERY,
    variables: { id },
  })

  const refetch = useCallback(() => executeQuery({ requestPolicy: "network-only" }), [executeQuery])

  useEffect(() => {
    if (result) {
      setData(result.publication)
    } else {
      setData(undefined)
    }
  }, [result])

  return { loading, data, refetch, executeQuery, chainId }
}

export default usePublication

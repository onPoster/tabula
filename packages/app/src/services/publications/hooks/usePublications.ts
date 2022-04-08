import { useCallback, useEffect, useState } from "react"
import { useQuery } from "urql"
import { Publications } from "../../../models/publication"
import { GET_PUBLICATIONS_QUERY } from "../queries"

const usePublications = () => {
  const [data, setData] = useState<Publications[] | undefined>(undefined)

  const [{ data: result, fetching: loading }, executeQuery] = useQuery({
    query: GET_PUBLICATIONS_QUERY,
  })

  const refetch = useCallback(() => executeQuery({ requestPolicy: "network-only" }), [executeQuery])

  useEffect(() => {
    if (result) {
      setData(result.publications)
    } else {
      setData(undefined)
    }
  }, [result])

  return { loading, data, refetch, executeQuery }
}

export default usePublications

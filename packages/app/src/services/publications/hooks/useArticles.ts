import { useCallback, useEffect, useState } from "react"
import { useQuery } from "urql"
import { Article } from "../../../models/publication"
import { GET_ARTICLES_QUERY } from "../queries"

const useArticles = () => {
  const [data, setData] = useState<Article[] | undefined>(undefined)

  const [{ data: result, fetching: loading }, executeQuery] = useQuery({
    query: GET_ARTICLES_QUERY,
  })

  const refetch = useCallback(() => executeQuery({ requestPolicy: "network-only" }), [executeQuery])

  useEffect(() => {
    if (result) {
      setData(result.articles)
    } else {
      setData(undefined)
    }
  }, [result])

  return { loading, data, refetch, executeQuery }
}

export default useArticles

import { useCallback, useEffect, useState } from "react"
import { useQuery } from "urql"
import { Article } from "../../../models/publication"
import { GET_ARTICLE_QUERY } from "../queries"

const useArticle = (id: string) => {
  const [data, setData] = useState<Article | undefined>(undefined)

  const [{ data: result, fetching: loading }, executeQuery] = useQuery({
    query: GET_ARTICLE_QUERY,
    variables: { id },
  })

  const refetch = useCallback(() => executeQuery({ requestPolicy: "network-only" }), [executeQuery])

  useEffect(() => {
    if (result) {
      setData(result.article)
    } else {
      setData(undefined)
    }
  }, [result])

  return { loading, data, refetch, executeQuery }
}

export default useArticle

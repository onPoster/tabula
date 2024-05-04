import { useState, useEffect } from "react"
import { TypedDocumentNode, useQuery } from "urql"

export const useMonitorTransaction = (query: TypedDocumentNode<any, object>, variables: object) => {
  const [isIndexed, setIsIndexed] = useState<boolean>(false)
  const [previousVariables, setPreviousVariables] = useState<object>({})

  const areVariablesValid = (vars: object) =>
    Object.values(vars).every((x) => x !== null && x !== undefined && x !== "")

  const [result, refetchQuery] = useQuery({
    query: query,
    variables,
    pause: !areVariablesValid(variables),
  })
  const { data, fetching, error } = result
  useEffect(() => {
    // Deep comparison of objects
    if (JSON.stringify(previousVariables) !== JSON.stringify(variables)) {
      setIsIndexed(false)
      setPreviousVariables(variables)
    }

    if (data && areVariablesValid(data)) {
      setIsIndexed(true)
    } else if (!isIndexed && !fetching && areVariablesValid(variables)) {
      const intervalId = setInterval(() => {
        refetchQuery({ requestPolicy: "network-only" })
      }, 5000)
      return () => clearInterval(intervalId)
    }
    if (error) {
      setIsIndexed(true)
    }
  }, [data, fetching, error, isIndexed, variables, refetchQuery, previousVariables])

  return { isIndexed, loading: fetching, error }
}

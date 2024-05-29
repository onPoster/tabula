import { useState, useEffect, useRef } from "react"
import { TypedDocumentNode, useQuery } from "urql"

export type TransactionType = "create" | "update" | "delete"

export const useMonitorTransaction = (
  query: TypedDocumentNode<any, object>,
  variables: object,
  transactionType: TransactionType,
  elementKey: string, // key for the element in the data
  defaultLastUpdated?: number | null,
) => {
  const [isIndexed, setIsIndexed] = useState<boolean>(false)
  const previousLastUpdated = useRef<number | null>(null)
  const previousVariables = useRef<object>({})
  const [queryResult, setQueryResult] = useState<Object>({})

  const areVariablesValid = (vars: object) =>
    Object.values(vars).every((x) => x !== null && x !== undefined && x !== "")

  const [result, refetchQuery] = useQuery({
    query: query,
    variables,
    pause: !areVariablesValid(variables),
  })
  const { data, fetching, error } = result
  useEffect(() => {
    // Accessing the element dynamically
    const element = data ? data[elementKey] : null

    setQueryResult(data)
    // Reset state if variables change
    if (JSON.stringify(previousVariables.current) !== JSON.stringify(variables)) {
      setIsIndexed(false)
      previousVariables.current = variables
      previousLastUpdated.current = null
    }

    if (transactionType === "create" && element) {
      setIsIndexed(true)
    }

    if (transactionType === "update" && element) {
      const currentLastUpdated = element.lastUpdated || null
      if (previousLastUpdated.current === null) {
        previousLastUpdated.current = defaultLastUpdated ?? currentLastUpdated
      } else if (currentLastUpdated !== previousLastUpdated.current) {
        setIsIndexed(true)
        previousLastUpdated.current = currentLastUpdated
      }
    }

    if (transactionType === "delete" && !element) {
      setIsIndexed(true)
    }

    if (error) {
      setIsIndexed(true)
    }
  }, [data, fetching, error, variables, elementKey, transactionType, defaultLastUpdated])

  useEffect(() => {
    if (!isIndexed && !fetching && areVariablesValid(variables)) {
      const intervalId = setInterval(() => {
        refetchQuery({ requestPolicy: "network-only" })
      }, 5000)
      return () => clearInterval(intervalId)
    }
  }, [isIndexed, fetching, variables, refetchQuery])

  return { isIndexed, loading: fetching, queryResult, error }
}

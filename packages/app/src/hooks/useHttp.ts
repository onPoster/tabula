import { useCallback, useState } from "react"
import { HttpRequest, HttpCallback, HttpHook, HttpError } from "../services/http/class"

export default function useHttp<T, B>(request: HttpRequest<T, B>, cb?: HttpCallback<T>): HttpHook<T, B> {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<HttpError | null>(null)
  const [response, setResponse] = useState<T | null>(null)

  const fetchApi = useCallback(
    async (body: B): Promise<T> => {
      setLoading(true)
      let error: HttpError | null = null
      try {
        const response = await request(body)
        const data = response as T
        setResponse(data)
        setError(null)
        if (cb) cb(data)
        return response
      } catch (err: any) {
        if (err.response && err.response.data) {
          error = new HttpError(err.response.status, err.response.data.message || err.response.data.error)
        } else error = err
        if (error) {
          setError(error)
          setResponse(null)
        }
        if (cb) cb({} as T, error as HttpError)
        else throw error
        return {} as T
      } finally {
        setLoading(false)
      }
    },
    [cb, request],
  )

  return [fetchApi, { loading, data: response, error }]
}

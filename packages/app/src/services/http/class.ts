export type HttpHook<T, B> = [
  (body: B) => Promise<T>,
  {
    loading: boolean
    data: T | null
    error: HttpError | null
  },
]
export type HttpConfig = Record<string, unknown>
export type HttpRequest<T, B> = (body: B) => Promise<T>
export type HttpCallback<T> = (data: T, error?: HttpError) => void
export class HttpError {
  status: number
  message: string

  constructor(status: number, message: string) {
    this.status = status
    this.message = message
  }
}

import { useEffect, useRef } from "react"

export const useUpdateCallbackRef = (callback: any) => {
  const callbackRef = useRef(callback)
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])
  return callbackRef
}

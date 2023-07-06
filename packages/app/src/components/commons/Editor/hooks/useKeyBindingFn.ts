import { getDefaultKeyBinding } from "draft-js"

const useKeyBindingFn = () => {
  return (event: React.KeyboardEvent): string | null => {
    if (event.key === "Enter") {
      return "split-block"
    }

    return getDefaultKeyBinding(event)
  }
}

export default useKeyBindingFn

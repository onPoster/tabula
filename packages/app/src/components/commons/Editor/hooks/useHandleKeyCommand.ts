import { EditorState, DraftHandleValue, RichUtils } from "draft-js"

const useHandleKeyCommand = (
  editorState: EditorState,
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>,
) => {
  return (command: string): DraftHandleValue => {
    const newState = RichUtils.handleKeyCommand(editorState, command)

    if (newState) {
      setEditorState(newState)
      return "handled"
    }

    return "not-handled"
  }
}

export default useHandleKeyCommand

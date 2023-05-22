import { EditorState, DraftHandleValue, RichUtils } from "draft-js"

const useHandleReturn = (
  editorState: EditorState,
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>,
  hasCommandModifier: (e: React.KeyboardEvent) => boolean,
) => {
  return (e: React.KeyboardEvent): DraftHandleValue => {
    if (e.altKey || !hasCommandModifier(e)) {
      return "not-handled"
    }

    setEditorState(RichUtils.insertSoftNewline(editorState))
    return "handled"
  }
}

export default useHandleReturn

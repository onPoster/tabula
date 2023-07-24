import { EditorState, DraftHandleValue, Modifier, RichUtils } from "draft-js"

const useHandleReturn = (
  editorState: EditorState,
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>,
  hasCommandModifier: (e: React.KeyboardEvent) => boolean,
) => {
  return (e: React.KeyboardEvent): DraftHandleValue => {
    if (e.shiftKey) {
      // If we press shift + return, add new line
      setEditorState(RichUtils.insertSoftNewline(editorState))
      return "handled"
    } else {
      // If we press return without shift, we create a new block
      const contentState = editorState.getCurrentContent()
      const selectionState = editorState.getSelection()

      let newContentState = Modifier.splitBlock(contentState, selectionState)
      newContentState = Modifier.setBlockType(newContentState, newContentState.getSelectionAfter(), "unstyled")
      const newEditorState = EditorState.push(editorState, newContentState, "split-block")

      setEditorState(newEditorState)
      return "handled"
    }
  }
}

export default useHandleReturn

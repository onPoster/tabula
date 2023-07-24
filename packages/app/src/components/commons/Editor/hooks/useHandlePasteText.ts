import { EditorState, DraftHandleValue, Modifier } from "draft-js"

const useHandlePastedText = (
  editorState: EditorState,
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>,
) => {
  return (text: string, html: string | undefined, editorState: EditorState): DraftHandleValue => {
    // We obtain the current content and selection;
    const contentState = editorState.getCurrentContent()
    const selectionState = editorState.getSelection()
    
    // Replace the text selected with the copied text and we use it as one block
    const newContentState = Modifier.replaceText(contentState, selectionState, text)
    const newEditorState = EditorState.push(editorState, newContentState, "insert-fragment")

    setEditorState(newEditorState)
    return "handled"
  }
}

export default useHandlePastedText

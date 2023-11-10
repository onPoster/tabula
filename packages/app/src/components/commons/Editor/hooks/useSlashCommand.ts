import { EditorState, Modifier } from "draft-js"
import { useArticleContext } from "../../../../services/publications/contexts"

const useHandleSlashCommand = () => {
  const { setShowBlockTypePopup } = useArticleContext()


  const handleSlashCommand = (editorState: EditorState) => {
    const selection = editorState.getSelection()
    const blockKey = selection.getStartKey()
    const block = editorState.getCurrentContent().getBlockForKey(blockKey)
    const blockText = block.getText()
    if (!blockText.endsWith("/")) {
      return editorState
    }

    // Remove the "/" and open the popup
    setShowBlockTypePopup(true)
    const newText = blockText.slice(0, -1)
    const contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      selection.merge({
        anchorOffset: newText.length,
        focusOffset: blockText.length,
      }),
      "",
    )
    return EditorState.push(editorState, contentState, "insert-characters") // You need to create a new EditorState object here
  }

  // Devuelve los estados y métodos que necesitará tu componente
  return {
    handleSlashCommand,
  }
}

export default useHandleSlashCommand

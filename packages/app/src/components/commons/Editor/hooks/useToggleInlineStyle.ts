import { useState } from "react"
import { EditorState, RichUtils } from "draft-js"

const useToggleInlineStyle = (editorState: EditorState, setEditorState: (editorState: EditorState) => void) => {
  const [showInlinePopup, setShowInlinePopup] = useState(false)

  const toggleInlineStyle = (inlineStyle: string) => {
    setShowInlinePopup(false)
    if (inlineStyle === "LINK") {
      return handleLink()
    }
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle))
  }

  const handleLink = () => {
    const contentState = editorState.getCurrentContent()
    const contentStateWithEntity = contentState.createEntity("LINK", "MUTABLE", { url: "https://tabula.gg" })
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity })
    // Applies the entity to the currently selected text.
    setEditorState(RichUtils.toggleLink(newEditorState, newEditorState.getSelection(), entityKey))
  }

  return { showInlinePopup, setShowInlinePopup, toggleInlineStyle }
}

export default useToggleInlineStyle

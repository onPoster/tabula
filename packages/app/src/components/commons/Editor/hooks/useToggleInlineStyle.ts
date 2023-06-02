import { useState } from "react"
import { EditorState, RichUtils } from "draft-js"
import { useArticleContext } from "../../../../services/publications/contexts"

const useToggleInlineStyle = (editorState: EditorState, setEditorState: (editorState: EditorState) => void) => {
  const [showInlinePopup, setShowInlinePopup] = useState(false)
  const { linkComponentUrl, setLinkComponentUrl } = useArticleContext()

  const toggleInlineStyle = (inlineStyle: string) => {
    if (inlineStyle === "LINK") {
      return handleLink()
    }
    let newState = RichUtils.toggleInlineStyle(editorState, inlineStyle)
    const newSelection = newState.getSelection().merge({
      anchorOffset: newState.getSelection().getEndOffset(),
      focusOffset: newState.getSelection().getEndOffset(),
    })
    newState = EditorState.acceptSelection(newState, newSelection)
    setEditorState(newState)
    setShowInlinePopup(false)
  }

  const handleLink = () => {
    const contentState = editorState.getCurrentContent()
    const contentStateWithEntity = contentState.createEntity("LINK", "MUTABLE", { url: linkComponentUrl })
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
    let newState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    })
    newState = RichUtils.toggleLink(newState, newState.getSelection(), entityKey)

    // Deselect the text
    const newSelection = newState.getSelection().merge({
      anchorOffset: newState.getSelection().getEndOffset(),
      focusOffset: newState.getSelection().getEndOffset(),
    })

    newState = EditorState.acceptSelection(newState, newSelection)
    setEditorState(newState)
    setLinkComponentUrl(undefined)
  }

  return { showInlinePopup, setShowInlinePopup, toggleInlineStyle }
}

export default useToggleInlineStyle

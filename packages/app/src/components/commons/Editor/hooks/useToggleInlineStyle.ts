import { useState } from "react"
import { EditorState, RichUtils } from "draft-js"
import { useArticleContext } from "../../../../services/publications/contexts"

const useToggleInlineStyle = (editorState: EditorState, setEditorState: (editorState: EditorState) => void) => {
  const [showInlinePopup, setShowInlinePopup] = useState(false)
  const { linkComponentUrl, setLinkComponentUrl } = useArticleContext()

  const toggleInlineStyle = (inlineStyle: string) => {
    setShowInlinePopup(false)
    if (inlineStyle === "LINK") {
      return handleLink()
    }
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle))
  }

  const handleLink = () => {
    const contentState = editorState.getCurrentContent()
    const contentStateWithEntity = contentState.createEntity("LINK", "MUTABLE", { url: linkComponentUrl })
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    })
    setEditorState(RichUtils.toggleLink(newEditorState, newEditorState.getSelection(), entityKey))
    setLinkComponentUrl(undefined)
  }

  return { showInlinePopup, setShowInlinePopup, toggleInlineStyle }
}

export default useToggleInlineStyle

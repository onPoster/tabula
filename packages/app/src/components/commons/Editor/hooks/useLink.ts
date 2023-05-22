import { RichUtils, EditorState } from "draft-js"

const useLink = (editorState: EditorState, setEditorState: React.Dispatch<React.SetStateAction<EditorState>>) => {
  const handleLink = () => {
    const contentState = editorState.getCurrentContent()
    const contentStateWithEntity = contentState.createEntity("LINK", "MUTABLE", { url: "https://tabula.gg" })
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity })

    setEditorState(RichUtils.toggleLink(newEditorState, newEditorState.getSelection(), entityKey))
  }

  return { handleLink }
}

export default useLink

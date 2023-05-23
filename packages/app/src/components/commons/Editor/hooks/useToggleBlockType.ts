import { Dispatch, SetStateAction, useCallback } from "react"
import { EditorState, RichUtils, DraftEditorCommand, AtomicBlockUtils } from "draft-js"
import useCustomComponentInsertion from "./useCustomComponentInsertion"
import { useArticleContext } from "../../../../services/publications/contexts"

type ToggleBlockType = {
  toggleBlockType: (blockType: string) => void
  insertImage: (uri: string, file: File) => void
}

const useToggleBlockType = (
  editorState: EditorState,
  setEditorState: Dispatch<SetStateAction<EditorState>>,
): ToggleBlockType => {
  const { setShowBlockTypePopup } = useArticleContext()
  const { insertCustomComponent } = useCustomComponentInsertion(editorState, setEditorState)

  const toggleBlockType: ToggleBlockType["toggleBlockType"] = (blockType) => {
    if (blockType === "hr") {
      insertCustomComponent("HR", {})
    } else if (blockType === "image") {
      insertCustomComponent("IMAGE", {})
    } else {
      setEditorState(RichUtils.toggleBlockType(editorState, blockType as DraftEditorCommand))
    }

    setShowBlockTypePopup(false)
  }

  const insertImage: ToggleBlockType["insertImage"] = useCallback(
    (uri: string, file: File) => {
      console.log("insertImage", uri)
      const contentState = editorState.getCurrentContent()
      const contentStateWithEntity = contentState.createEntity("IMAGE", "IMMUTABLE", { uri, file })
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
      const newEditorState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, " ")

      setEditorState(newEditorState)
    },
    [editorState, setEditorState],
  )

  return { toggleBlockType, insertImage }
}

export default useToggleBlockType

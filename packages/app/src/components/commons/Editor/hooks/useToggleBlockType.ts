import { Dispatch, SetStateAction } from "react"
import { EditorState, RichUtils, DraftEditorCommand } from "draft-js"
import useCustomComponentInsertion from "./useCustomComponentInsertion"
import { useArticleContext } from "../../../../services/publications/contexts"

type ToggleBlockType = (blockType: string) => void

const useToggleBlockType = (
  editorState: EditorState,
  setEditorState: Dispatch<SetStateAction<EditorState>>,
): ToggleBlockType => {
  const { setShowBlockTypePopup } = useArticleContext()
  const { insertCustomComponent } = useCustomComponentInsertion(editorState, setEditorState)

  const toggleBlockType: ToggleBlockType = (blockType) => {
    if (blockType === "hr") {
      insertCustomComponent("HR", {})
    } else if (blockType === "image") {
      insertCustomComponent("IMAGE", {})
    } else {
      setEditorState(RichUtils.toggleBlockType(editorState, blockType as DraftEditorCommand))
    }

    setShowBlockTypePopup(false)
  }

  return toggleBlockType
}

export default useToggleBlockType

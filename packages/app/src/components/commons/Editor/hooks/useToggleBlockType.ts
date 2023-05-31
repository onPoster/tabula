import { Dispatch, SetStateAction, useState } from "react"
import { EditorState, RichUtils, DraftEditorCommand } from "draft-js"
import useCustomComponentInsertion from "./useCustomComponentInsertion"
import { useArticleContext } from "../../../../services/publications/contexts"

type ToggleBlockType = {
  toggleBlockType: (blockType: string) => void
  showImagePicker: boolean
  changeImagePickerState: (show: boolean) => void
}

const useToggleBlockType = (
  editorState: EditorState,
  setEditorState: Dispatch<SetStateAction<EditorState>>,
): ToggleBlockType => {
  const { setShowBlockTypePopup } = useArticleContext()
  const { insertCustomComponent } = useCustomComponentInsertion(editorState, setEditorState)
  const [showImagePicker, setShowImagePicker] = useState<boolean>(false)

  const changeImagePickerState = (show: boolean) => {
    setShowImagePicker(show)
  }
  const toggleBlockType: ToggleBlockType["toggleBlockType"] = (blockType) => {
    if (blockType === "hr") {
      insertCustomComponent("HR", {})
    } else if (blockType === "image-picker") {
      setShowImagePicker(true)
    } else {
      setEditorState(RichUtils.toggleBlockType(editorState, blockType as DraftEditorCommand))
    }

    setShowBlockTypePopup(false)
  }

  return { toggleBlockType, showImagePicker, changeImagePickerState }
}

export default useToggleBlockType

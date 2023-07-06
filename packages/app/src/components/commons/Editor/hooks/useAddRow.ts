import { ContentBlock, genKey, ContentState, SelectionState, EditorState } from "draft-js"
import { List } from "immutable"

const useAddRow = (editorState: EditorState, setEditorState: (editorState: EditorState) => void) => {
  const addRow = () => {
    const selectionState = editorState.getSelection()
    const contentState = editorState.getCurrentContent()
    const blockMap = contentState.getBlockMap()

    const newBlock = new ContentBlock({
      key: genKey(),
      type: "unstyled",
      text: "",
      characterList: List(),
    })

    const newBlockMap = blockMap
      .toSeq()
      .concat([[newBlock.getKey(), newBlock]])
      .toOrderedMap()

    const newContentState = contentState.merge({
      blockMap: newBlockMap,
      selectionBefore: selectionState,
      selectionAfter: selectionState,
    }) as ContentState

    const newEditorState = EditorState.push(editorState, newContentState, "insert-fragment")

    const focusSelection = new SelectionState({
      anchorKey: newBlock.getKey(),
      anchorOffset: 0,
      focusKey: newBlock.getKey(),
      focusOffset: 0,
    })

    setEditorState(EditorState.forceSelection(newEditorState, focusSelection))
  }

  return { addRow }
}

export default useAddRow

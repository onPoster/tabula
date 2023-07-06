import { ContentState, EditorState, SelectionState } from "draft-js"

const useDeleteRow = (editorState: EditorState, setEditorState: React.Dispatch<React.SetStateAction<EditorState>>) => {
  const deleteRow = () => {
    const contentState = editorState.getCurrentContent()
    const selectionState = editorState.getSelection()
    const key = selectionState.getAnchorKey()

    const blockMap = contentState.getBlockMap()

    const block = contentState.getBlockForKey(key)
    const blocksBefore = blockMap.toSeq().takeUntil((v) => v === block)
    if (blocksBefore.last()) {
      const blocksAfter = blockMap
        .toSeq()
        .skipUntil((v) => v === block)
        .rest()
      const newBlocks = blocksBefore.concat(blocksAfter).toOrderedMap()

      const focusKey = blocksBefore.last().getKey()
      const newContentState = contentState.merge({
        blockMap: newBlocks,
        selectionBefore: selectionState,
        selectionAfter: selectionState.merge({
          anchorKey: focusKey,
          focusKey: focusKey,
        }),
      })

      const newSelection = new SelectionState({
        anchorKey: focusKey,
        anchorOffset: contentState.getBlockForKey(focusKey).getLength(),
        focusKey: focusKey,
        focusOffset: contentState.getBlockForKey(focusKey).getLength(),
      })

      let newEditorState = EditorState.push(editorState, newContentState as ContentState, "remove-range")
      newEditorState = EditorState.forceSelection(newEditorState, newSelection)
      setEditorState(newEditorState)
      return newEditorState
    }
  }

  return { deleteRow }
}

export default useDeleteRow

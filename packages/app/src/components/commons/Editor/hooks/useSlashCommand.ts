import { EditorState, Modifier, SelectionState } from "draft-js"
import { useState } from "react"

const useHandleSlashCommand = () => {
  const handleSlashCommand = (editorState: EditorState): EditorState => {
    const selection = editorState.getSelection()
    const blockKey = selection.getStartKey()
    const block = editorState.getCurrentContent().getBlockForKey(blockKey)
    const blockText = block.getText()
    if (!blockText.endsWith("/")) {
      return editorState
    }

    // Remove the "/" and open the popup
    const newText = blockText.slice(0, -1)
    const contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      selection.merge({
        anchorOffset: newText.length,
        focusOffset: blockText.length,
      }),
      "",
    )
    const newEditorState = EditorState.push(editorState, contentState, "insert-characters")

    const blockLength = newText.length
    const focusSelection = new SelectionState({
      anchorKey: blockKey,
      anchorOffset: blockLength,
      focusKey: blockKey,
      focusOffset: blockLength,
    })

    return EditorState.forceSelection(newEditorState, focusSelection)
  }

  return { handleSlashCommand }
}

export default useHandleSlashCommand

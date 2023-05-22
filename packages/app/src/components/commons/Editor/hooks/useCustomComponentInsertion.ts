import { AtomicBlockUtils, EditorState } from "draft-js"

const useCustomComponentInsertion = (
  editorState: EditorState,
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>,
) => {
  const insertCustomComponent = (entityType: string, data: Object | undefined) => {
    const contentState = editorState.getCurrentContent()
    const contentStateWithEntity = contentState.createEntity(entityType, "IMMUTABLE", data)
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
    const newEditorState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, " ")

    setEditorState(newEditorState)
  }

  return { insertCustomComponent }
}

export default useCustomComponentInsertion

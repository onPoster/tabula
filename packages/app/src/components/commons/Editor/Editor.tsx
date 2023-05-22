import React, { useEffect, useRef, useState } from "react"
import {
  EditorState,
  ContentBlock,
  KeyBindingUtil,
  Modifier,
  SelectionState,
  Entity,
  CompositeDecorator,
} from "draft-js"
import DraftEditor from "draft-js-plugins-editor"
import "draft-js/dist/Draft.css"
import { Box } from "@mui/material"
import EditorBlockItem from "./EditorBlock"
import EditorHr from "./EditorComponents/EditorHr"
// import EditorImage from "./EditorComponents/EditorImage"
import { stateToHTML } from "draft-js-export-html"
import { useArticleContext } from "../../../services/publications/contexts"
import EditorInlineText from "./EditorInlineText"
import { useNavigate } from "react-router-dom"
import { stateFromHTML } from "draft-js-import-html"
import useLinkDecorator from "./hooks/useLinkDecorator"
import useHandleKeyCommand from "./hooks/useHandleKeyCommand"
import useKeyBindingFn from "./hooks/useKeyBindingFn"
import useHandleReturn from "./hooks/useHandleReturn"
import useToggleBlockType from "./hooks/useToggleBlockType"
import useToggleInlineStyle from "./hooks/useToggleInlineStyle"
import useAddRow from "./hooks/useAddRow"
import useDeleteRow from "./hooks/useDeleteRow"

const { hasCommandModifier } = KeyBindingUtil

const Editor: React.FC = () => {
  const {
    setShowBlockTypePopup,
    setArticleEditorState,
    setStoreArticleContent,
    storeArticleContent,
    articleEditorState,
    draftArticlePath,
  } = useArticleContext()
  const navigate = useNavigate()
  const linkDecorator = useLinkDecorator()
  const decorators = new CompositeDecorator(linkDecorator)
  const handleInitialValue = () => {
    if (articleEditorState) {
      const contentState = stateFromHTML(articleEditorState)
      return EditorState.createWithContent(contentState, decorators)
    }
    return EditorState.createEmpty(decorators)
  }
  const [editorState, setEditorState] = useState(handleInitialValue)
  const [pendingEditorState, setPendingEditorState] = useState(null)
  const editor = useRef<DraftEditor>(null)
  const { addRow } = useAddRow(editorState, setEditorState)
  const { deleteRow } = useDeleteRow(editorState, setEditorState)
  const { showInlinePopup, toggleInlineStyle, setShowInlinePopup } = useToggleInlineStyle(editorState, setEditorState)

  const handleKeyCommand = useHandleKeyCommand(editorState, setEditorState)
  const keyBindingFn = useKeyBindingFn()
  const handleReturn = useHandleReturn(editorState, setEditorState, hasCommandModifier)
  const toggleBlockType = useToggleBlockType(editorState, setEditorState)

  useEffect(() => {
    editor.current?.focus()
  }, [])

  useEffect(() => {
    if (storeArticleContent && draftArticlePath) {
      let html = stateToHTML(editorState.getCurrentContent())
      // Post-process HTML.
      html = html.replace(/<figure>&nbsp;<\/figure>/g, "<hr/>")
      setArticleEditorState(html)
      navigate(draftArticlePath)
      setStoreArticleContent(false)
      setArticleEditorState(html)
    }
  }, [storeArticleContent, draftArticlePath, editorState, navigate, setStoreArticleContent, setArticleEditorState])

  useEffect(() => {
    if (pendingEditorState) {
      setPendingEditorState(null)
    }
  }, [pendingEditorState])

  /** Method to detect selection **/
  useEffect(() => {
    const currentSelection = editorState.getSelection()
    const start = currentSelection.getStartOffset()
    const end = currentSelection.getEndOffset()

    if (start !== end) {
      setShowInlinePopup(true)
    } else {
      setShowInlinePopup(false)
    }
  }, [editorState, setShowInlinePopup])

  const handleSlashCommand = (editorState: EditorState) => {
    const selection = editorState.getSelection()
    const blockKey = selection.getStartKey()
    const block = editorState.getCurrentContent().getBlockForKey(blockKey)
    const blockText = block.getText()
    if (!blockText.endsWith("/")) {
      return editorState
    }

    // Remove the "/" and open the popup
    setShowBlockTypePopup(true)
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

  const handleState = (editorState: EditorState) => {
    const finalEditorState = handleSlashCommand(editorState)
    setEditorState(finalEditorState)
  }

  const atomicBlockPlugin = {
    blockRendererFn: (block: ContentBlock) => {
      if (block.getType() === "atomic") {
        const entityKey = block.getEntityAt(0)
        if (entityKey) {
          const entity = Entity.get(entityKey)
          if (entity.getType() === "HR") {
            return {
              component: EditorHr,
              editable: false,
            }
          }
        }
      }
      return {
        component: EditorBlockItem,
        editable: true,
        props: { toggleBlockType, editorState, onAdd: addRow, onDelete: deleteRow },
      }
    },
  }
  return (
    <Box>
      <DraftEditor
        ref={editor}
        editorState={editorState}
        // blockRendererFn={blockRendererFn}
        plugins={[atomicBlockPlugin]}
        onChange={handleState}
        handleKeyCommand={handleKeyCommand}
        keyBindingFn={keyBindingFn}
        handleReturn={handleReturn}
        placeholder="Type '/' for commands..."
      />
      <EditorInlineText showCommand={showInlinePopup} onClick={(slug) => toggleInlineStyle(slug)} />
    </Box>
  )
}

export default Editor

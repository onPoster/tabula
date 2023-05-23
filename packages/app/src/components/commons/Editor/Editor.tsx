import React, { useEffect, useRef, useState } from "react"
import {
  EditorState,
  ContentBlock,
  KeyBindingUtil,
  CompositeDecorator,
  Editor as DraftEditor,
  ContentState,
  DraftInlineStyleType,
  RawDraftEntity,
  DraftEntityMutability,
} from "draft-js"
import "draft-js/dist/Draft.css"
import { Box } from "@mui/material"
import EditorBlockItem from "./EditorBlock"
import EditorHr from "./EditorComponents/EditorHr"
// import EditorImage from "./EditorComponents/EditorImage"
import {
  convertToHTML,
  IConvertToHTMLConfig,
  convertFromHTML,
  IConvertFromHTMLConfig,
  ExtendedHTMLElement,
} from "draft-convert"
import { useArticleContext } from "../../../services/publications/contexts"
import EditorInlineText from "./EditorInlineText"
import { useNavigate } from "react-router-dom"
import useLinkDecorator from "./hooks/useLinkDecorator"
import useHandleKeyCommand from "./hooks/useHandleKeyCommand"
import useKeyBindingFn from "./hooks/useKeyBindingFn"
import useHandleReturn from "./hooks/useHandleReturn"
import useToggleBlockType from "./hooks/useToggleBlockType"
import useToggleInlineStyle from "./hooks/useToggleInlineStyle"
import useAddRow from "./hooks/useAddRow"
import useDeleteRow from "./hooks/useDeleteRow"
import useHandleSlashCommand from "./hooks/useSlashCommand"

const { hasCommandModifier } = KeyBindingUtil
type Config = IConvertToHTMLConfig<DraftInlineStyleType, string, RawDraftEntity>

const Editor: React.FC = () => {
  const { setArticleEditorState, setStoreArticleContent, storeArticleContent, articleEditorState, draftArticlePath } =
    useArticleContext()
  const navigate = useNavigate()
  const linkDecorator = useLinkDecorator()
  const decorators = new CompositeDecorator(linkDecorator)
  const handleInitialValue = () => {
    if (articleEditorState) {
      const optionsFromHTML: IConvertFromHTMLConfig<DOMStringMap, string, RawDraftEntity<{ [key: string]: any }>> = {
        htmlToEntity: (
          nodeName: string,
          node: HTMLElement,
          createEntity: (type: string, mutability: DraftEntityMutability, data: object) => string,
        ) => {
          if (nodeName === "hr") {
            return createEntity("HR", "IMMUTABLE", {})
          }
        },
        htmlToBlock: (
          nodeName: string,
          node: ExtendedHTMLElement<DOMStringMap>,
        ): string | false | { type: string; data: object } | undefined => {
          if (nodeName === "hr") {
            return {
              type: "atomic",
              data: {},
            }
          }
          return undefined
        },
        htmlToStyle: (nodeName: string, node: HTMLElement, currentStyle: Set<string>): Set<string> => {
          if (nodeName === "hr") {
            return currentStyle.add("HR")
          }
          return currentStyle
        },
      }
      const contentState = convertFromHTML(optionsFromHTML)(articleEditorState)
      console.log("contentState", contentState)
      return EditorState.createWithContent(contentState, decorators)
    }
    return EditorState.createEmpty(decorators)
  }
  const [editorState, setEditorState] = useState(handleInitialValue)
  const [pendingEditorState, setPendingEditorState] = useState(null)
  const editor = useRef<DraftEditor>(null)
  const [inlineEditorOffset, setInlineEditorOffset] = useState({ left: 0, top: 0 })
  const { addRow } = useAddRow(editorState, setEditorState)
  const { deleteRow } = useDeleteRow(editorState, setEditorState)
  const { showInlinePopup, toggleInlineStyle, setShowInlinePopup } = useToggleInlineStyle(editorState, setEditorState)
  const { handleSlashCommand } = useHandleSlashCommand()
  const handleKeyCommand = useHandleKeyCommand(editorState, setEditorState)
  const keyBindingFn = useKeyBindingFn()
  const handleReturn = useHandleReturn(editorState, setEditorState, hasCommandModifier)
  const toggleBlockType = useToggleBlockType(editorState, setEditorState)

  useEffect(() => {
    editor.current?.focus()
  }, [])

  useEffect(() => {
    if (storeArticleContent && draftArticlePath) {
      const optionsToHTML: Partial<Config> = {
        blockToHTML: (block) => {
          if (block.type === "atomic") {
            return { start: "<hr/>", end: "" }
          }
          return undefined
        },
      }

      const html = convertToHTML(optionsToHTML)(editorState.getCurrentContent() as ContentState)
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

    const editorRoot = editor.current
    const anchorKey = currentSelection.getAnchorKey()

    if (editorRoot) {
      const selectedBlockNodeParent = document.querySelector(`[data-offset-key="${anchorKey}-0-0"]`)
      const AVERAGE_CHAR_WIDTH = 7

      if (selectedBlockNodeParent) {
        const selectionWidth = (end - start) * AVERAGE_CHAR_WIDTH
        const rect = selectedBlockNodeParent.getBoundingClientRect()
        const posX = rect.left + start * AVERAGE_CHAR_WIDTH + selectionWidth / 2
        const posY = rect.top - 64

        setInlineEditorOffset({ left: posX, top: posY })
      }
    }

    if (start !== end) {
      setShowInlinePopup(true)
    } else {
      setShowInlinePopup(false)
    }
  }, [editorState, setShowInlinePopup])

  const handleState = (editorState: EditorState) => {
    const finalEditorState = handleSlashCommand(editorState)
    setEditorState(finalEditorState)
  }

  const blockRendererFn = (block: ContentBlock) => {
    if (block.getType() === "atomic") {
      const contentState = editorState.getCurrentContent()
      const entityKey = block.getEntityAt(0)
      const entity = contentState.getEntity(entityKey)
      if (entity.getType() === "HR") {
        return {
          component: EditorHr,
          editable: false,
        }
      }
    }
    return {
      component: EditorBlockItem,
      editable: true,
      props: { toggleBlockType, editorState, onAdd: addRow, onDelete: deleteRow },
    }
  }
  return (
    <Box>
      <DraftEditor
        ref={editor}
        editorState={editorState}
        blockRendererFn={blockRendererFn}
        onChange={handleState}
        handleKeyCommand={handleKeyCommand}
        keyBindingFn={keyBindingFn}
        handleReturn={handleReturn}
        placeholder="Type '/' for commands..."
      />
      <EditorInlineText
        editorState={editorState}
        showCommand={showInlinePopup}
        inlineEditorOffset={inlineEditorOffset}
        onClick={(slug) => toggleInlineStyle(slug)}
      />
    </Box>
  )
}

export default Editor

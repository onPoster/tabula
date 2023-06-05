import React, { useEffect, useRef, useState } from "react"
import {
  EditorState,
  ContentBlock,
  KeyBindingUtil,
  CompositeDecorator,
  ContentState,
  DraftInlineStyleType,
  RawDraftEntity,
  DraftEntityMutability,
  Editor as DraftEditor,
  AtomicBlockUtils,
} from "draft-js"
import "draft-js/dist/Draft.css"
import { Box } from "@mui/material"
import EditorBlockItem from "./EditorBlock"
import EditorHr from "./EditorComponents/EditorHr"
import { convertToHTML, IConvertToHTMLConfig, convertFromHTML, IConvertFromHTMLConfig } from "draft-convert"
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
import EditorImagePicker from "./EditorComponents/EditorImagePicker"
import EditorLink from "./EditorComponents/EditorLink"
import EditorShowImage from "./EditorComponents/EditoShowImage"

const { hasCommandModifier } = KeyBindingUtil
type Config = IConvertToHTMLConfig<DraftInlineStyleType, string, RawDraftEntity>

const Editor: React.FC = () => {
  const {
    setArticleEditorState,
    setStoreArticleContent,
    storeArticleContent,
    articleEditorState,
    draftArticlePath,
    contentImageFiles,
    setContentImageFiles,
    setLinkComponentUrl,
  } = useArticleContext()
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
          if (nodeName === "img" && contentImageFiles) {
            const element = node as HTMLImageElement
            const file = contentImageFiles.find((file) => file.lastModified === parseInt(element.alt))
            return createEntity("IMAGE", "IMMUTABLE", { src: element.src, file })
          }
          if (nodeName === "img" && !contentImageFiles) {
            const element = node as HTMLImageElement
            return createEntity("IMAGE", "IMMUTABLE", { src: element.src, file: undefined })
          }
          if (nodeName === "hr") {
            return createEntity("HR", "IMMUTABLE", {})
          }
          if (nodeName === "a") {
            return createEntity("LINK", "MUTABLE", { url: (node as HTMLAnchorElement).href })
          }
        },
        htmlToBlock: (
          nodeName: string,
          node: HTMLElement,
        ): string | false | { type: string; data: object } | undefined => {
          if (nodeName === "hr") {
            return {
              type: "atomic",
              data: {},
            }
          }
          if (nodeName === "img" && contentImageFiles) {
            const element = node as HTMLImageElement
            const file = contentImageFiles.find((file) => file.lastModified === parseInt(element.alt))
            return {
              type: "atomic",
              data: {
                src: element.src,
                file,
              },
            }
          }
          if (nodeName === "img" && !contentImageFiles) {
            const element = node as HTMLImageElement
            return {
              type: "atomic",
              data: {
                src: element.src,
                file: undefined,
              },
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
  const { toggleBlockType, showImagePicker, changeImagePickerState } = useToggleBlockType(editorState, setEditorState)

  useEffect(() => {
    editor.current?.focus()
  }, [])

  useEffect(() => {
    if (!showInlinePopup) {
      setLinkComponentUrl(undefined)
    }
  }, [setLinkComponentUrl, showInlinePopup])

  useEffect(() => {
    if (storeArticleContent) {
      const optionsToHTML: Partial<Config> = {
        styleToHTML: (style) => {
          if (style === "STRIKETHROUGH") {
            return <del />
          }
        },
        entityToHTML: (entity, originalText) => {
          if (entity.type === "HR") {
            return `<hr />`
          }
          if (entity.type === "LINK") {
            return <EditorLink url={entity.data.url}>{originalText}</EditorLink>
          }
          if (entity.type === "IMAGE") {
            const { file, src } = entity.data
            let uri
            if (src.includes("https")) {
              uri = src
            }
            if (file) {
              uri = URL.createObjectURL(file)
            }
            return `<img src="${uri}" alt="${file?.lastModified}" />`
          }
          return originalText
        },
      }
      const html = convertToHTML(optionsToHTML)(editorState.getCurrentContent() as ContentState)
      setArticleEditorState(html)
      setStoreArticleContent(false)
    }
    if (draftArticlePath) {
      navigate(draftArticlePath)
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

  const onImageSelected = (uri: any, file: any) => {
    const currentFiles = contentImageFiles ? [...contentImageFiles] : []
    setContentImageFiles([...currentFiles, file])
    const contentState = editorState.getCurrentContent()
    const contentStateWithEntity = contentState.createEntity("IMAGE", "IMMUTABLE", { src: uri, file: file })
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity })

    // move the cursor to the end
    const lastBlock = contentState.getLastBlock()
    const lengthOfLastBlock = lastBlock.getLength()
    const selection = editorState.getSelection()
    const newSelection = selection.merge({
      anchorOffset: lengthOfLastBlock,
      focusOffset: lengthOfLastBlock,
      anchorKey: lastBlock.getKey(),
      focusKey: lastBlock.getKey(),
    })
    const newStateWithCursorAtEnd = EditorState.forceSelection(newEditorState, newSelection)
    const editorStateWithImage = AtomicBlockUtils.insertAtomicBlock(newStateWithCursorAtEnd, entityKey, " ")
    setEditorState(editorStateWithImage)
  }

  const blockRendererFn = (block: ContentBlock) => {
    if (block.getType() === "atomic") {
      const contentState = editorState.getCurrentContent()
      const entityKey = block.getEntityAt(0)
      if (entityKey) {
        const entity = contentState.getEntity(entityKey)
        if (entity.getType() === "HR") {
          return {
            component: EditorHr,
            editable: false,
          }
        }
        if (entity.getType() === "IMAGE") {
          return {
            component: EditorShowImage,
            editable: false,
            props: {
              file: entity.getData().file,
              src: entity.getData().src,
              editorState,
            },
          }
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
      {showImagePicker && (
        <EditorImagePicker
          editorState={editorState}
          onImageSelected={(uri, file) => {
            onImageSelected(uri, file)
            changeImagePickerState(false)
          }}
        />
      )}
    </Box>
  )
}

export default Editor

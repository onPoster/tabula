import { Box } from "@mui/system"
import React, { Fragment, useEffect, useRef, useState } from "react"
import ContentEditable, { ContentEditableEvent } from "react-contenteditable"
import useRefCallback from "../../hooks/useRefCallback"
import RichText from "./RichText"

export interface EditableBlockProps {
  block: Block
  updatePage: (block: Block) => void
  addBlock: (element: { id: string; ref: HTMLElement }) => void
  deleteBlock: (element: { id: string; ref: HTMLElement }) => void
}

export interface Block {
  id: string
  html: string
  tag: string
  previousKey?: string
  htmlBackup?: null | string
  imageUrl?: string
  placeholder?: boolean
  isTyping?: boolean
  tagSelectorMenuOpen?: boolean
  tagSelectorMenuPosition?: {
    x: number
    y: number
  }
  actionMenuOpen?: false
  actionMenuPosition?: {
    x: number
    y: number
  }
}

const CMD_KEY = "/"
export const EditableBlock: React.FC<EditableBlockProps> = ({ block, updatePage, addBlock, deleteBlock }) => {
  const contentEditableRef = useRef<null | HTMLElement>(null)
  // const [currentBlock, setCurrentBlock] = useState<Block>(block)
  // const { id, html, tag, imageUrl } = currentBlock
  // const [showCommand, setShowCommand] = useState<boolean>(false)
  const [html, setHtml] = useState<string>("")
  const [tag, setTag] = useState<string>("p")
  const [htmlBackup, setHtmlBackup] = useState<null | string>(null)
  const [previousKey, setPreviousKey] = useState<string>("")
  const [selectMenuIsOpen, setSelectMenuIsOpen] = useState<boolean>(false)
  const [selectMenuPosition, setSelectMenuPosition] = useState<{
    x: number | undefined
    y: number | undefined
  }>({ x: 0, y: 0 })

  const getCaretCoordinates = () => {
    let x, y
    const selection = window.getSelection()
    if (selection && selection.rangeCount !== 0) {
      const range = selection.getRangeAt(0).cloneRange()
      range.collapse(false)
      const rect = range.getClientRects()[0]
      if (rect) {
        x = rect.left
        y = rect.top
      }
    }
    return { x, y }
  }

  const handleChange = (evt: ContentEditableEvent) => {
    const value = evt.target.value
    if (!value.includes("<div><br></div>")) {
      setHtml(value)
      updatePage({ id: block.id, html: value, tag })
    }
  }

  const onKeyUpHandler = useRefCallback(
    (e: ContentEditableEvent) => {
      if (e.key === CMD_KEY) {
        const { x, y } = getCaretCoordinates()
        setSelectMenuPosition({ x, y })
        setHtmlBackup(html)
      }
      if (e.key === "Enter") {
        if (previousKey !== "Shift") {
          e.preventDefault()
          if (contentEditableRef.current) {
            addBlock({ id: block.id, ref: contentEditableRef.current })
          }
        }
      }

      if (e.key === "Backspace" && !html) {
        e.preventDefault()
        if (contentEditableRef.current) {
          deleteBlock({ id: block.id, ref: contentEditableRef.current })
        }
      }
      setPreviousKey(e.key)
    },
    [html, previousKey],
  )

  const handleCommand = (tag: string) => {
    updatePage({ id: block.id, html, tag })
    setTag(tag)
    setSelectMenuIsOpen(false)
  }
  const handleDeleteBlock = () => {
    if (contentEditableRef.current) {
      deleteBlock({ id: block.id, ref: contentEditableRef.current })
    }
  }

  return (
    <Box sx={{ position: "relative" }}>
      <Box sx={{ position: "absolute", left: -30, top: 3 }}>
        <RichText
          onRichTextSelected={handleCommand}
          showCommand={selectMenuIsOpen}
          onDelete={handleDeleteBlock}
          x={selectMenuPosition.x ?? 0}
          y={selectMenuPosition.y ?? 0}
        />
      </Box>
      {/**@ts-ignore*/}
      <ContentEditable
        id={block.id}
        className={tag}
        innerRef={contentEditableRef}
        html={html}
        tagName={tag}
        onChange={handleChange}
        onKeyUp={onKeyUpHandler}
      />
    </Box>
  )
}
// const handleBlur = useRefCallback(() => {
//   // console.log(text) // 👍 correct value
//   // updatePage({ html: text, id, tag })
// }, [text])

//When the component loads
// useEffect(() => {
//   if (contentEditableRef && contentEditableRef.current) {
//     const hasPlaceholder = addPlaceholder({
//       block: contentEditableRef.current,
//       position: 1,
//       content: html || (imageUrl ?? ""),
//     })
//     console.log('hasPlaceholder', hasPlaceholder)
//     if (!hasPlaceholder) {
//       setCurrentBlock({
//         ...currentBlock,
//       })
//     }
//   }
// }, [contentEditableRef])

// const handleOnKeyDown = useRefCallback(
//   (evt) => {
//     switch (evt.key) {
//       case "Enter":
//         if (currentBlock.previousKey !== "Shift") {
//           setShowCommand(false)
//           return addBlock({ html: text, id, tag })
//         }
//         break

//       case CMD_KEY:
//         setCurrentBlock({ ...block, htmlBackup: text })
//         return setShowCommand(true)

//       case "Backspace":
//         if (!currentBlock.html) {
//           return deleteBlock({ html: text, id, tag })
//         }
//         break
//     }
//   },
//   [text],
// )

// const handleCommand = (tag: string) => {
//   let currentText = text
//   if (currentText.includes(CMD_KEY)) {
//     currentText = text.replace(CMD_KEY, "")
//   }
//   setText(currentText)
//   setCurrentBlock({
//     id,
//     html: currentText,
//     tag,
//   })
// }

// const handleDeleteBlock = () => {
//   setShowCommand(false)
//   return deleteBlock({ html: text, id, tag })
// }

// Show a placeholder for blank pages
// const addPlaceholder = ({ block, position, content }: { block: HTMLElement; position: number; content: string }) => {
//   const isFirstBlockWithoutHtml = position === 1 && !content
//   if (block.parentElement) {
//     const isFirstBlockWithoutSibling = !block.parentElement.nextElementSibling
//     if (isFirstBlockWithoutHtml && isFirstBlockWithoutSibling) {
//       setCurrentBlock({
//         id,
//         html: "Type a article title",
//         tag: "h1",
//         imageUrl: "",
//         placeholder: true,
//         isTyping: false,
//       })
//       return true
//     } else {
//       return false
//     }
//   }
//   return false
// }

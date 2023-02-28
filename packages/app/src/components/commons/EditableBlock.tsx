import React, { Fragment, useEffect, useState } from "react"
import { uid } from "uid"

import { findIndex } from "lodash"
import { ContentEditableEvent } from "react-contenteditable"
import { Block, EditableItemBlock } from "./EditableItemBlock"
import RichText, { RICH_TEXT_ELEMENTS } from "./RichText"
import { Box } from "@mui/material"
import { usePublicationContext } from "../../services/publications/contexts"

export const EditableBlock: React.FC = () => {
  const { setArticleContent, articleContent, setIsEditing } = usePublicationContext()
  const [previousKey, setPreviousKey] = useState<string>("")
  const [newElementId, setNewElementId] = useState<string | null>(null)
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const [menuId, setMenuId] = useState<string | undefined>(undefined)

  /**
   * Method to collect the new HTML Element by id
   * and focus
   */
  useEffect(() => {
    if (newElementId) {
      const newElement = document.getElementById(newElementId)
      if (newElement) {
        newElement.focus()
        setNewElementId(null)
      }
    }
  }, [newElementId])

  const updatePageHandler = (event: ContentEditableEvent, blockId: string) => {
    const value = event.target.value
    if (!value.includes("/")) {
      const index = findIndex(articleContent, { id: blockId })
      const updatedBlocks = [...articleContent]
      updatedBlocks[index] = {
        ...updatedBlocks[index],
        html: value,
      }
      setIsEditing(true)
      setArticleContent(updatedBlocks)
    }
  }

  const onKeyDownHandler = (e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    const currentBlock = articleContent[index]
    if (e.key === "/") {
      setShowMenu(true)
      setMenuId(currentBlock.id)
    }
    if (e.key === "Enter") {
      if (previousKey !== "Shift") {
        e.preventDefault()
        addBlockHandler({
          id: currentBlock.id,
        })
      }
    }
    if (e.key === "Backspace" && !currentBlock.html && currentBlock.html === "") {
      e.preventDefault()
      deleteBlock({
        id: currentBlock.id,
        index,
      })
    }
    setPreviousKey(e.key)
  }

  const addBlockHandler = (block: { id: string }, customBlocks?: Block[]) => {
    const newId = uid()
    const newBlock = { id: newId, html: "", tag: "p" }
    const currentBlocks = customBlocks ? customBlocks : [...articleContent]
    const index = currentBlocks.map((b) => b.id).indexOf(block.id)
    currentBlocks.splice(index + 1, 0, newBlock)
    setIsEditing(true)
    setArticleContent(currentBlocks)
    setNewElementId(newId)
  }

  const deleteBlock = (block: { id: string; index: number }) => {
    if (block.index) {
      const previousBlockPosition = articleContent[block.index - 1]
      const previousBlock = document.getElementById(previousBlockPosition.id)
      const currentBlocks = [...articleContent]
      currentBlocks.splice(block.index, 1)
      setArticleContent(currentBlocks)
      setIsEditing(true)
      if (previousBlock) {
        setCaretToEnd(previousBlock)
        previousBlock.focus()
      }
    }
  }

  const setCaretToEnd = (element: HTMLElement) => {
    const range = document.createRange()
    const selection = window.getSelection()
    range.selectNodeContents(element)
    range.collapse(false)
    if (selection) {
      selection.removeAllRanges()
      selection.addRange(range)
    }
    element.focus()
  }

  const onImage = (uri: string, file: File, index: number) => {
    const updatedBlocks = [...articleContent]
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      imageUrl: uri ? uri : undefined,
      imageFile: file,
    }
    setIsEditing(true)
    setArticleContent(updatedBlocks)
  }

  const handleCommand = (tag: string, blockIndex: number) => {
    const currentBlocks = [...articleContent]
    currentBlocks[blockIndex] = {
      ...currentBlocks[blockIndex],
      tag,
    }

    if (tag === RICH_TEXT_ELEMENTS.DIVIDER || tag === RICH_TEXT_ELEMENTS.IMAGE) {
      currentBlocks[blockIndex].html = ""
      setShowMenu(false)
      setMenuId(undefined)
      return addBlockHandler(
        {
          id: currentBlocks[blockIndex].id,
        },
        currentBlocks,
      )
    }
    setShowMenu(false)
    setMenuId(undefined)
    setArticleContent(currentBlocks)
  }

  return (
    <Fragment>
      {articleContent.map((block, index) => {
        const isHeader = block.tag.match(/h\d/)
        return (
          <Box
            key={index}
            sx={{
              position: "relative",
              cursor: "text",
              mt: isHeader ? 2 : 1,
              "&:hover .rich-text": {
                opacity: 1,
              },
            }}
          >
            <Box
              className="rich-text"
              sx={{ opacity: 0, position: "absolute", right: "100%", top: "50%", transform: "translateY(-50%)", pr: 1 }}
            >
              <RichText
                key={`rich-text-${block.id}`}
                onRichTextSelected={(tag) => handleCommand(tag, index)}
                showCommand={showMenu && menuId === block.id}
                onDelete={() =>
                  deleteBlock({
                    id: block.id,
                    index,
                  })
                }
              />
            </Box>
            <EditableItemBlock
              key={block.id}
              block={block}
              onChange={(event) => updatePageHandler(event, block.id)}
              onKeyDown={(e) => onKeyDownHandler(e, index)}
              onImageSelected={(image, file) => onImage(image, file, index)}
              placeholder={block.tag !== RICH_TEXT_ELEMENTS.DIVIDER ? `Type '/' for commands...` : undefined}
            />
          </Box>
        )
      })}
    </Fragment>
  )
}

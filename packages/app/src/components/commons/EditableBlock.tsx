import React, { Fragment, useEffect, useState } from "react"
import { uid } from "uid"

import { findIndex } from "lodash"
import { ContentEditableEvent } from "react-contenteditable"
import { Block, EditableItemBlock } from "./EditableItemBlock"
import RichText, { RICH_TEXT_ELEMENTS } from "./RichText"
import { palette } from "../../theme"
import { Box } from "@mui/material"

const INITIAL_BLOCK = { id: uid(), html: "", tag: "p" }

export const EditableBlock: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([INITIAL_BLOCK])
  const [previousKey, setPreviousKey] = useState<string>("")

  const [newElementId, setNewElementId] = useState<string | null>(null)
  const [showMenu, setShowMenu] = useState<boolean>(false)

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
      const index = findIndex(blocks, { id: blockId })
      const updatedBlocks = [...blocks]
      updatedBlocks[index] = {
        ...updatedBlocks[index],
        html: value,
      }
      setBlocks(updatedBlocks)
    }
  }

  const onKeyDownHandler = (e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    const currentBlock = blocks[index]
    if (e.key === "/") {
      setShowMenu(true)
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
    const currentBlocks = customBlocks ? customBlocks : [...blocks]
    const index = currentBlocks.map((b) => b.id).indexOf(block.id)
    currentBlocks.splice(index + 1, 0, newBlock)
    setBlocks(currentBlocks)
    setNewElementId(newId)
  }

  const deleteBlock = (block: { id: string; index: number }) => {
    if (block.index) {
      const previousBlockPosition = blocks[block.index - 1]
      const previousBlock = document.getElementById(previousBlockPosition.id)
      const currentBlocks = [...blocks]
      currentBlocks.splice(block.index, 1)
      setBlocks(currentBlocks)
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

  const onImage = (uri: string, index: number) => {
    const updatedBlocks = [...blocks]
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      imageUrl: uri ? uri : undefined,
    }
    setBlocks(updatedBlocks)
  }

  const handleCommand = (tag: string, blockIndex: number) => {
    const currentBlocks = [...blocks]
    currentBlocks[blockIndex] = {
      ...currentBlocks[blockIndex],
      tag,
    }

    if (tag === RICH_TEXT_ELEMENTS.DIVIDER) {
      setShowMenu(false)
      return addBlockHandler(
        {
          id: currentBlocks[blockIndex].id,
        },
        currentBlocks,
      )
    }
    setShowMenu(false)
    setBlocks(currentBlocks)
  }

  return (
    <Fragment>
      {blocks.map((block, index) => (
        <Box
          sx={{
            position: "relative",
            cursor: "text",
            "&:hover .rich-text": {
              opacity: 1,
            },
            "& [contenteditable='true']:focus-visible": {
              outline: "none",
            },
            "& [contenteditable]:empty:after": {
              content: "attr(placeholder)",
              color: palette.grays[600],
            },
          }}
        >
          <Box className="rich-text" sx={{ opacity: 0, position: "absolute", left: -30, bottom: 3 }}>
            <RichText
              onRichTextSelected={(tag) => handleCommand(tag, index)}
              showCommand={showMenu}
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
            onImageSelected={(image) => onImage(image, index)}
            placeholder={block.tag !== RICH_TEXT_ELEMENTS.DIVIDER ? `Type '/' for commands...` : undefined}
          />
        </Box>
      ))}
    </Fragment>
  )
}

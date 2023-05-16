import React, { Fragment, useEffect, useState } from "react"
import { uid } from "uid"
import { ContentEditableEvent } from "react-contenteditable"
import { Block, EditableItemBlock } from "./EditableItemBlock"
import RichText, { RICH_TEXT_ELEMENTS } from "./RichText"
import { Box } from "@mui/material"
import { useArticleContext } from "../../services/publications/contexts"

export const EditableBlock: React.FC = () => {
  const { setArticleContent, articleContent, updateArticleContent, addNewBlock, deleteBlock } = useArticleContext()
  const [previousKey, setPreviousKey] = useState<string>("")
  const [newElementId, setNewElementId] = useState<string | null>(null)
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const [placeholderFocused, setPlaceholderFocused] = useState<string | null>(null)
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

  const checkPlaceholderState = (block: Block) => {
    const focusId = block.id

    const showPlaceholder = block.tag !== RICH_TEXT_ELEMENTS.DIVIDER && placeholderFocused === focusId
    return showPlaceholder ? `Type '/' for commands...` : undefined
  }

  const updatePageHandler = (event: ContentEditableEvent, blockId: string) => {
    const value = event.target.value
    if (!value.includes("/")) {
      updateArticleContent(blockId, value)
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
      handleDeleteBlock({
        id: currentBlock.id,
        index,
      })
    }
    setPreviousKey(e.key)
  }

  const addBlockHandler = (block: { id: string }, customBlocks?: Block[]) => {
    const newId = uid()
    addNewBlock(block, newId, customBlocks)
    setNewElementId(newId)
  }

  const handleDeleteBlock = (block: { id: string; index: number }) => {
    deleteBlock(block)
  }

  const onImage = (uri: string, file: File, index: number) => {
    const updatedBlocks = [...articleContent]
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      imageUrl: uri ? uri : undefined,
      imageFile: file,
    }
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
            key={block.id}
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
                  handleDeleteBlock({
                    id: block.id,
                    index,
                  })
                }
                onAdd={() =>
                  addBlockHandler({
                    id: block.id,
                  })
                }
              />
            </Box>
            <EditableItemBlock
              key={`item-block-${block.id}`}
              block={block}
              onChange={(event) => updatePageHandler(event, block.id)}
              onKeyDown={(e) => onKeyDownHandler(e, index)}
              onBlur={() => setPlaceholderFocused(null)}
              onFocus={() => setPlaceholderFocused(block.id)}
              onImageSelected={(image, file) => onImage(image, file, index)}
              placeholder={checkPlaceholderState(block)}
            />
          </Box>
        )
      })}
    </Fragment>
  )
}

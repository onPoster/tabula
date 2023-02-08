import React, { Fragment, useEffect, useState } from "react"
import { uid } from "uid"
import usePrevious from "../../../../hooks/usePrevious"
import { Block, EditableBlock } from "../../../commons/EditableBlock"
import { findIndex, remove } from "lodash"

const INITIAL_BLOCK = { id: uid(), html: "", tag: "p" }

export const ArticleContentSection: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([INITIAL_BLOCK])
  const [newElementId, setNewElementId] = useState<string | null>(null)
  const [prevElementId, setPrevElementId] = useState<string | null>(null)
  // const prevBlocks: Block[] | undefined = usePrevious(blocks)

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

  /**
   * Method to collect the new HTML Element by id
   * and focus
   */
  useEffect(() => {
    if (prevElementId) {
      const oldElement = document.getElementById(prevElementId)
      if (oldElement) {
        setCaretToEnd(oldElement)
        oldElement.focus()
        setNewElementId(null)
      }
    }
  }, [prevElementId])

  console.log("blocks", blocks)

  const updatePageHandler = (block: Block) => {
    const index = findIndex(blocks, { id: block.id })
    const updatedBlocks = [...blocks]
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: block.tag,
      html: block.html,
    }

    setBlocks(updatedBlocks)
  }

  const addBlockHandler = (block: { id: string; ref: HTMLElement }) => {
    const newId = uid()
    const newBlock = { id: newId, html: "", tag: "p" }
    const currentBlocks = [...blocks]
    const index = blocks.map((b) => b.id).indexOf(block.id)
    currentBlocks.splice(index + 1, 0, newBlock)
    setNewElementId(newId)
    setBlocks(currentBlocks)
  }

  const deleteBlock = (block: { id: string; ref: HTMLElement }) => {
    const previousBlock = block.ref.previousElementSibling
    if (previousBlock) {
      const prevId = previousBlock.id
      // const index = blocks.map((b) => b.id).indexOf(block.id)
      const currentBlocks = [...blocks]
      const elem = remove(currentBlocks, {
        id: block.id,
      })
      console.log("block.id", block.id)
      console.log("elem", elem)
      // currentBlocks.splice(index, 1)
      setPrevElementId(prevId)
      setBlocks(currentBlocks)
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

  return (
    <Fragment>
      {blocks.map((block) => {
        return (
          <EditableBlock
            key={block.id}
            block={block}
            updatePage={updatePageHandler}
            addBlock={addBlockHandler}
            deleteBlock={deleteBlock}
          />
        )
      })}
    </Fragment>
  )
}

// useEffect(() => {
//   //@ts-ignore
//   if (prevBlocks && blocks && prevBlocks.length < blocks.length) {
//     const currentElement = document.getElementById(blocks[blocks.length - 1].id)
//     if (currentElement) {
//       return currentElement.focus()
//     }
//   }
// }, [prevBlocks, blocks])

// const addBlockHandler = (block: Block) => {
//   const newBlock = { id: uid(), html: " ", tag: "p" }
//   const currentBlocks = [...blocks]
//   const index = currentBlocks.map((b) => b.id).indexOf(block.id)
//   currentBlocks[index] = {
//     ...currentBlocks[index],
//     tag: block.tag,
//     html: block.html,
//   }
//   currentBlocks.splice(index + 1, 0, newBlock)
//   setBlocks(currentBlocks)
//   // const currentElement = document.getElementById(newBlock.id)
//   // console.log("currentElement", currentElement)
//   // if (currentElement && currentElement.nextElementSibling) {
//   //   return (currentElement.nextElementSibling as HTMLElement)?.focus()
//   // }
// }

// const deleteBlock = (block: Block) => {
//   const currentBlocks = [...blocks]
//   if (currentBlocks.length >= 1) {
//     const index = currentBlocks.map((b) => b.id).indexOf(block.id)
//     currentBlocks.splice(index, 1)
//     const currentElement = document.getElementById(blocks[index].id)
//     if (currentElement) {
//       const element = currentElement.previousElementSibling as HTMLElement
//       if (element) {
//         setCaretToEnd(element)
//       }
//     }
//     setBlocks(currentBlocks)
//   }
// }

// const setCaretToEnd = (element: HTMLElement) => {
//   const range = document.createRange()
//   const selection = window.getSelection()
//   range.selectNodeContents(element)
//   range.collapse(false)
//   if (selection) {
//     selection.removeAllRanges()
//     selection.addRange(range)
//   }
//   element.focus()
// }

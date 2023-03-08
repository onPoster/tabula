import TurndownService from "turndown"
import { uid } from "uid"
import { Block } from "../components/commons/EditableItemBlock"
import { RICH_TEXT_ELEMENTS } from "../components/commons/RichText"

const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY
const turndownService = new TurndownService({ headingStyle: "atx" })

if (IPFS_GATEWAY == null) {
  throw new Error("REACT_APP_IPFS_GATEWAY is not set")
}

export function shortAddress(address: string) {
  return address.substr(0, 6) + "..." + address.substr(-4)
}

export function shortTitle(str: string, n: number) {
  return str.length > n ? str.substr(0, n - 1) + "..." : str
}

export const toBase64 = (file: File) =>
  new Promise((resolve: (result: string) => void) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
  })

const getBlocksByTag = (html: string, tag: RICH_TEXT_ELEMENTS): Block[] => {
  let newBlock: Block[] = []
  let firstTagElementIndex: number
  let lastTagElementIndex: number
  const htmlContentArray = html.split(" ")

  htmlContentArray.forEach((word, index) => {
    if (word === `className=${tag}>` && tag !== RICH_TEXT_ELEMENTS.IMAGE && tag !== RICH_TEXT_ELEMENTS.DIVIDER) {
      firstTagElementIndex = index
    }
    if (word === `</${tag}>` && tag !== RICH_TEXT_ELEMENTS.IMAGE && tag !== RICH_TEXT_ELEMENTS.DIVIDER) {
      lastTagElementIndex = index
    }
    if (word === `<img` && tag === RICH_TEXT_ELEMENTS.IMAGE) {
      const path = htmlContentArray[index + 2]
      let imageSrc = path.substring(path.indexOf(`"`) + 1).replace(`"`, "")
      if (!imageSrc.includes("https://")) {
        imageSrc = `${IPFS_GATEWAY}/${imageSrc} `
      }
      newBlock.push({ tag, id: uid(), html: "", imageUrl: imageSrc })
    }
    if (word === `<hr` && tag === RICH_TEXT_ELEMENTS.DIVIDER) {
      newBlock.push({ tag, id: uid(), html: "" })
    }

    if (firstTagElementIndex && lastTagElementIndex) {
      const articleWords = htmlContentArray.slice(firstTagElementIndex + 1, lastTagElementIndex)
      newBlock.push({ tag, id: uid(), html: articleWords.join(" ") })
      firstTagElementIndex = 0
      lastTagElementIndex = 0
    }
  })
  return newBlock
}

export const checkTag = (html: string): Block[] => {
  let newBlocks: Block[] = []
  if (html.includes(RICH_TEXT_ELEMENTS.H1)) {
    const content = getBlocksByTag(html, RICH_TEXT_ELEMENTS.H1)
    newBlocks = [...newBlocks, ...content]
  }
  if (html.includes(RICH_TEXT_ELEMENTS.H2)) {
    const content = getBlocksByTag(html, RICH_TEXT_ELEMENTS.H2)
    newBlocks = [...newBlocks, ...content]
  }
  if (html.includes(RICH_TEXT_ELEMENTS.H3)) {
    const content = getBlocksByTag(html, RICH_TEXT_ELEMENTS.H3)
    newBlocks = [...newBlocks, ...content]
  }
  if (html.includes(RICH_TEXT_ELEMENTS.H4)) {
    const content = getBlocksByTag(html, RICH_TEXT_ELEMENTS.H4)
    newBlocks = [...newBlocks, ...content]
  }
  if (html.includes(RICH_TEXT_ELEMENTS.H5)) {
    const content = getBlocksByTag(html, RICH_TEXT_ELEMENTS.H5)
    newBlocks = [...newBlocks, ...content]
  }
  if (html.includes(RICH_TEXT_ELEMENTS.H6)) {
    const content = getBlocksByTag(html, RICH_TEXT_ELEMENTS.H6)
    newBlocks = [...newBlocks, ...content]
  }
  if (html.includes(RICH_TEXT_ELEMENTS.PARAGRAPH)) {
    const content = getBlocksByTag(html, RICH_TEXT_ELEMENTS.PARAGRAPH)
    newBlocks = [...newBlocks, ...content]
  }
  if (html.includes(RICH_TEXT_ELEMENTS.QUOTE)) {
    const content = getBlocksByTag(html, RICH_TEXT_ELEMENTS.QUOTE)
    newBlocks = [...newBlocks, ...content]
  }
  if (html.includes(RICH_TEXT_ELEMENTS.CODE)) {
    const content = getBlocksByTag(html, RICH_TEXT_ELEMENTS.CODE)
    newBlocks = [...newBlocks, ...content]
  }
  if (html.includes(RICH_TEXT_ELEMENTS.DIVIDER)) {
    const content = getBlocksByTag(html, RICH_TEXT_ELEMENTS.DIVIDER)
    newBlocks = [...newBlocks, ...content]
  }
  if (html.includes(RICH_TEXT_ELEMENTS.IMAGE)) {
    const content = getBlocksByTag(html, RICH_TEXT_ELEMENTS.IMAGE)
    newBlocks = [...newBlocks, ...content]
  }
  return newBlocks
}

export const convertToBlock = (html: string): Block[] => {
  const newBlocks = checkTag(html)
  return newBlocks
}

export const convertToMarkdown = (html: string): string => {
  let htmlContent = html
  if (html.includes("img") && html.includes("src=")) {
    htmlContent = html.replace(`src="`, `src="${IPFS_GATEWAY}/`)
  }
  const markdown = turndownService.turndown(htmlContent)
  return markdown
}

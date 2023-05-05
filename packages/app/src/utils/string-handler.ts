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

const createBlockFromElement = (element: Element, tag: RICH_TEXT_ELEMENTS): Block => {
  let id = element.getAttribute("id") || uid()
  let imageUrl = ""
  let html = ""

  if (tag === RICH_TEXT_ELEMENTS.IMAGE) {
    const src = element.getAttribute("src")
    if (src) {
      imageUrl = src.includes("https://") ? src : `${IPFS_GATEWAY}/${src}`
    }
  } else {
    html = element.innerHTML
  }

  return { tag, id, html, imageUrl }
}

export const checkTag = (html: string): Block[] => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")
  const elements = doc.body.children

  let newBlocks: Block[] = []

  const elementsArray = Array.from(elements)

  for (const element of elementsArray) {
    const tag = element.tagName.toLowerCase() as RICH_TEXT_ELEMENTS
    if (Object.values(RICH_TEXT_ELEMENTS).includes(tag)) {
      newBlocks.push(createBlockFromElement(element, tag))
    }
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
    const regex = /src="/g
    htmlContent = html.replace(regex, `src="${IPFS_GATEWAY}/`)
  }
  const markdown = turndownService.turndown(htmlContent)
  return markdown
}

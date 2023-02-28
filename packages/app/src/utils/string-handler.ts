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

export const convertToHtml = async (blocks: Block[]): Promise<string> => {
  let html = ""

  await Promise.all(
    blocks.map(async (block) => {
      let tag = block.tag
      let image: string = ""
      if (block.imageFile) {
        image = await toBase64(block.imageFile)
      }
      if (block.imageUrl) {
        //Check if the img is a B64 or hash
        const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/
        if (base64regex.test(block.imageUrl)) {
          image = block.imageUrl
        } else {
          image = `${IPFS_GATEWAY}/${block.imageUrl}`
        }
      }
      if (block.tag === RICH_TEXT_ELEMENTS.DIVIDER) {
        tag = "div"
      }
      if (block.tag === RICH_TEXT_ELEMENTS.IMAGE) {
        tag = "img"
      }

      return (html = `${html}<${tag} id=${block.id} ${
        block.tag === RICH_TEXT_ELEMENTS.IMAGE && image ? `src="${image}" alt="img-${block.id}"` : ""
      } className=${block.tag}>${block.html}</${tag}> `)
    }),
  )

  console.log("html", html)
  return html
}

export const checkTag = (html: string): Block[] => {
  console.log("html", html)
  const newBlocks: Block[] = []
  if (html.includes(RICH_TEXT_ELEMENTS.H1)) {
    const content = html.substring(
      html.indexOf(`${RICH_TEXT_ELEMENTS.H1}>`) + 3,
      html.lastIndexOf(`</${RICH_TEXT_ELEMENTS.H1}>`),
    )
    newBlocks.push({ tag: RICH_TEXT_ELEMENTS.H1, id: uid(), html: content })
  }
  if (html.includes(RICH_TEXT_ELEMENTS.H2)) {
    const content = html.substring(
      html.indexOf(`${RICH_TEXT_ELEMENTS.H2}>`) + 3,
      html.lastIndexOf(`</${RICH_TEXT_ELEMENTS.H2}>`),
    )
    newBlocks.push({ tag: RICH_TEXT_ELEMENTS.H2, id: uid(), html: content })
  }
  if (html.includes(RICH_TEXT_ELEMENTS.H3)) {
    const content = html.substring(
      html.indexOf(`${RICH_TEXT_ELEMENTS.H3}>`) + 3,
      html.lastIndexOf(`</${RICH_TEXT_ELEMENTS.H3}>`),
    )
    newBlocks.push({ tag: RICH_TEXT_ELEMENTS.H3, id: uid(), html: content })
  }
  if (html.includes(RICH_TEXT_ELEMENTS.H4)) {
    const content = html.substring(
      html.indexOf(`${RICH_TEXT_ELEMENTS.H4}>`) + 3,
      html.lastIndexOf(`</${RICH_TEXT_ELEMENTS.H4}>`),
    )
    newBlocks.push({ tag: RICH_TEXT_ELEMENTS.H4, id: uid(), html: content })
  }
  if (html.includes(RICH_TEXT_ELEMENTS.H5)) {
    const content = html.substring(
      html.indexOf(`${RICH_TEXT_ELEMENTS.H5}>`) + 3,
      html.lastIndexOf(`</${RICH_TEXT_ELEMENTS.H5}>`),
    )
    newBlocks.push({ tag: RICH_TEXT_ELEMENTS.H5, id: uid(), html: content })
  }
  if (html.includes(RICH_TEXT_ELEMENTS.H6)) {
    const content = html.substring(
      html.indexOf(`${RICH_TEXT_ELEMENTS.H6}>`) + 3,
      html.lastIndexOf(`</${RICH_TEXT_ELEMENTS.H6}>`),
    )
    newBlocks.push({ tag: RICH_TEXT_ELEMENTS.H6, id: uid(), html: content })
  }
  if (html.includes(RICH_TEXT_ELEMENTS.PARAGRAPH)) {
    const content = html.substring(
      html.indexOf(`${RICH_TEXT_ELEMENTS.PARAGRAPH}>`) + 2,
      html.lastIndexOf(`</${RICH_TEXT_ELEMENTS.PARAGRAPH}>`),
    )

    newBlocks.push({ tag: RICH_TEXT_ELEMENTS.PARAGRAPH, id: uid(), html: content })
  }
  if (html.includes(RICH_TEXT_ELEMENTS.DIVIDER)) {
    newBlocks.push({ tag: RICH_TEXT_ELEMENTS.DIVIDER, id: uid(), html: "" })
  }
  if (html.includes(RICH_TEXT_ELEMENTS.IMAGE)) {
    let content = html.substring(html.indexOf(`src="`) + 5, html.lastIndexOf(`" alt="`))
    if (!content.includes("https://")) {
      content = `${IPFS_GATEWAY}/${content} `
    }
    newBlocks.push({ tag: RICH_TEXT_ELEMENTS.IMAGE, id: uid(), html: "", imageUrl: content })
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

import { uid } from "uid"
import { Block } from "../components/commons/EditableItemBlock"
import { RICH_TEXT_ELEMENTS } from "../components/commons/RichText"

export const convertToHtml = (blocks: Block[]): string => {
  let html = ""
  blocks.forEach((block) => {
    let tag = block.tag
    if (block.tag === RICH_TEXT_ELEMENTS.DIVIDER) {
      tag = "div"
    }
    if (block.tag === RICH_TEXT_ELEMENTS.IMAGE) {
      tag = "img"
    }

    return (html = `${html}<${tag} id=${block.id} ${
      block.tag === RICH_TEXT_ELEMENTS.IMAGE && block.imageUrl ? `src="${block.imageUrl}" alt="img-${block.id}"` : ""
    } className=${block.tag}>${block.html}</${tag}>`)
  })
  return html
}

export const checkTag = (html: string): Block[] => {
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
      html.indexOf(`${RICH_TEXT_ELEMENTS.PARAGRAPH}>`) + 3,
      html.lastIndexOf(`</${RICH_TEXT_ELEMENTS.PARAGRAPH}>`),
    )
    newBlocks.push({ tag: RICH_TEXT_ELEMENTS.PARAGRAPH, id: uid(), html: content })
  }
  return newBlocks
}

export const convertToBlock = (html: string): Block[] => {
  const newBlocks = checkTag(html)
  return newBlocks
}

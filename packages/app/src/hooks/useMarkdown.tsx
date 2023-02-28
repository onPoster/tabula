import { useState } from "react"
import { Block } from "../components/commons/EditableItemBlock"
import { RICH_TEXT_ELEMENTS } from "../components/commons/RichText"
import { useIpfs } from "./useIpfs"

export const useMarkdown = () => {
  const { uploadContent, getImgSrc } = useIpfs()
  const [loading, setLoading] = useState<boolean>(false)

  const convertToHtml = async (blocks: Block[], addUrlPrefix: boolean): Promise<string> => {
    setLoading(true)
    let html = ""
    let delay = 0
    const delayIncrement = 800
    const promises = blocks.map(async (block) => {
      delay += delayIncrement
      return new Promise((resolve) => setTimeout(resolve, delay)).then(async () => {
        let tag = block.tag
        let image: string = ""

        if (block.tag === RICH_TEXT_ELEMENTS.DIVIDER) {
          tag = "hr"
        }
        if (block.tag === RICH_TEXT_ELEMENTS.IMAGE) {
          tag = "img"
          if (block.imageFile) {
            const content = await uploadContent(block.imageFile)
            image = await getImgSrc(content.path)
          }
          if (block.imageUrl) {
            if (addUrlPrefix) {
              image = await getImgSrc(block.imageUrl)
            } else {
              image = block.imageUrl
            }
          }
        }

        return (html = `${html}<${tag} id=${block.id} ${
          block.tag === RICH_TEXT_ELEMENTS.IMAGE && image ? `src="${image}" alt="img-${block.id}"` : ""
        } className=${block.tag}> ${block.html} </${tag}> `)
      })
    })
    await Promise.all(promises)
    setLoading(false)
    return html
  }
  return { convertToHtml, loading }
}

export default useMarkdown

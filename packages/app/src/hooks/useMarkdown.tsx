import { useState } from "react"
import { Block } from "../components/commons/EditableItemBlock"
import { RICH_TEXT_ELEMENTS } from "../components/commons/RichText"
import { useIpfs } from "./useIpfs"

export const useMarkdown = () => {
  const { uploadContent, getImgSrc, getImgHash } = useIpfs()
  const [loading, setLoading] = useState<boolean>(false)

  const convertToHtml = async (
    blocks: Block[],
    addUrlPrefix: boolean,
    isDraft: boolean,
    type: "publish" | "read",
  ): Promise<string> => {
    setLoading(true)
    const promises = blocks.map(async (block) => {
      let tag = block.tag
      let image: string = ""

      if (block.tag === RICH_TEXT_ELEMENTS.DIVIDER) {
        tag = "hr"
      }
      if (block.tag === RICH_TEXT_ELEMENTS.IMAGE) {
        tag = "img"

        if (block.imageFile && !isDraft) {
          const content = await uploadContent(block.imageFile)
          if (addUrlPrefix) {
            image = await getImgSrc(content.path)
          } else {
            image = content.path
          }
        }
        if (block.imageFile && isDraft) {
          image = URL.createObjectURL(block.imageFile)
        }

        if (block.imageUrl) {
          if (addUrlPrefix) {
            image = await getImgSrc(block.imageUrl)
          } else {
            image = getImgHash(block.imageUrl, true)
          }
        }
        if (block.imageUrl && isDraft && type === "read") {
          image = getImgHash(block.imageUrl, false)
        }
        if (block.imageUrl && type === "publish") {
          image = getImgHash(block.imageUrl, true)
        }
      }

      return `<${tag} id=${block.id} ${
        block.tag === RICH_TEXT_ELEMENTS.IMAGE && image ? `src="${image}" alt="img-${block.id}"` : ""
      } className=${block.tag}> ${block.html} </${tag}> `
    })

    const results = await Promise.allSettled(promises)
    setLoading(false)
    return results.map((result: any) => result.value).join("")
  }
  return { convertToHtml, loading }
}

export default useMarkdown

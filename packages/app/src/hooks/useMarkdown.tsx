import { useState } from "react"
import { Block } from "../components/commons/EditableItemBlock"
import { RICH_TEXT_ELEMENTS } from "../components/commons/RichText"
import { IPFS_GATEWAY, useIpfs } from "./useIpfs"

export const useMarkdown = () => {
  const { uploadContent, getImgSrc } = useIpfs()
  const [loading, setLoading] = useState<boolean>(false)

  const removePrefix = (url: string, prefix: string) => {
    if (url.startsWith(prefix)) {
      return url.slice(prefix.length)
    }
    return url
  }

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

        if (block.imageUrl && IPFS_GATEWAY) {
          if (addUrlPrefix && !block.imageUrl.includes(IPFS_GATEWAY)) {
            image = await getImgSrc(block.imageUrl)
          } else {
            image = block.imageUrl
          }
        }
        if (block.imageUrl && isDraft && IPFS_GATEWAY && type === "read" && block.imageUrl.includes(IPFS_GATEWAY)) {
          image = block.imageUrl
        }
        if (block.imageUrl && IPFS_GATEWAY && block.imageUrl.includes(IPFS_GATEWAY) && type === "publish") {
          image = removePrefix(block.imageUrl, `${IPFS_GATEWAY}/`)
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

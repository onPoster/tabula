import { ArticleAction } from "@/models/publication"
import { ArticleFormSchema, UpdateArticleFormSchema } from "@/schemas/article.schema"
import { ImportCandidate } from "kubo-rpc-client"

export const extractAndReplaceImageHashes = (htmlString: string): { hashes: string[]; modifiedHtml: string } => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, "text/html")
  const imgElements = doc.querySelectorAll("img")
  const hashes: string[] = []

  imgElements.forEach((img) => {
    const src = img.getAttribute("src")
    if (src && src.startsWith("https://ipfs.io/ipfs/")) {
      const hash = src.replace("https://ipfs.io/ipfs/", "")
      img.setAttribute("src", hash)
      hashes.push(hash)
    }
  })
  const modifiedHtml = new XMLSerializer().serializeToString(doc.documentElement)
  return { hashes, modifiedHtml }
}
export const addUrlToImageHashes = (htmlString: string): string => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, "text/html")

  // Get all the img elements in the document
  const images = doc.getElementsByTagName("img")

  // Update the src attribute for each img element
  for (let img of images) {
    const src = img.getAttribute("src")
    if (src && !src.startsWith("https://ipfs.io/ipfs/")) {
      img.setAttribute("src", `https://ipfs.io/ipfs/${src}`)
    }
  }

  // Serialize the DOM object back into a string
  return new XMLSerializer().serializeToString(doc)
}

const processArticleBody = async (
  publicationId: string,
  form: ArticleFormSchema | UpdateArticleFormSchema,
  action: ArticleAction,
  encodeIpfsHash: (content: ImportCandidate) => Promise<string | undefined>,
  isDirectlyOnChain: boolean,
) => {
  const tags = form.tags?.map((tag) => tag.value)
  const parsedArticle = extractAndReplaceImageHashes(form.article)
  // Encode image if it's a File
  let image: string | undefined
  if (form.image instanceof File) {
    image = await encodeIpfsHash(form.image)
  } else if (typeof form.image === "string") {
    image = form.image
  } else {
    image = undefined
  }

  const articleHash = !isDirectlyOnChain ? await encodeIpfsHash(parsedArticle.modifiedHtml) : undefined
  // Create publication body
  const articleBody: Record<string, any> = {
    action,
    publicationId,
    article: articleHash ? articleHash : parsedArticle.modifiedHtml,
    title: form.title,
    ...(tags ? { tags } : { tags: "" }),
    ...(form.description ? { description: form.description } : { description: " " }),
    ...(image ? { image } : { image: "" }),
  }

  // Add id if it's an update
  if ("id" in form) {
    articleBody.id = form.id
  }

  return { articleBody, imgHashes: articleHash ? parsedArticle.hashes.concat(articleHash) : parsedArticle.hashes }
}

export const generateArticleBody = async (
  publicationId: string,
  form: ArticleFormSchema,
  encodeIpfsHash: (content: ImportCandidate) => Promise<string | undefined>,
  isDirectlyOnChain: boolean,
) => {
  console.log('isDirectlyOnChain', isDirectlyOnChain)
  return processArticleBody(publicationId, form, "article/create", encodeIpfsHash, isDirectlyOnChain)
}

export const generateUpdateArticleBody = async (
  publicationId: string,
  form: UpdateArticleFormSchema,
  encodeIpfsHash: (content: ImportCandidate) => Promise<string | undefined>,
  isDirectlyOnChain: boolean,
) => {
  return processArticleBody(publicationId, form, "article/update", encodeIpfsHash, isDirectlyOnChain)
}

export const deleteArticleBody = async (id: string) => {
  return {
    action: "article/delete",
    id,
  }
}

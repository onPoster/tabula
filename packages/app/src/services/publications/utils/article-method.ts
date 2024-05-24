import { ArticleAction } from "@/models/publication"
import { ArticleFormSchema, UpdateArticleFormSchema } from "@/schemas/article.schema"

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

const processArticleBody = async (
  publicationId: string,
  form: ArticleFormSchema | UpdateArticleFormSchema,
  action: ArticleAction,
  encodeImage: (file: File) => Promise<string | undefined>,
) => {
  const tags = form.tags?.map((tag) => tag.value)
  const parsedArticle = extractAndReplaceImageHashes(form.article)
  // Encode image if it's a File
  let image: string | undefined
  if (form.image instanceof File) {
    image = await encodeImage(form.image)
  } else if (typeof form.image === "string") {
    image = form.image
  } else {
    image = undefined
  }

  // Create publication body
  const articleBody: Record<string, any> = {
    action,
    publicationId,
    article: parsedArticle.modifiedHtml,
    title: form.title,
    ...(tags ? { tags } : { tags: "" }),
    ...(form.description ? { description: form.description } : { description: " " }),
    ...(image ? { image } : { image: "" }),
  }

  // Add id if it's an update
  if ("id" in form) {
    articleBody.id = form.id
  }

  return { articleBody, imgHashes: parsedArticle.hashes }
}

export const generateArticleBody = async (
  publicationId: string,
  form: ArticleFormSchema,
  encodeImage: (file: File) => Promise<string | undefined>,
) => {
  return processArticleBody(publicationId, form, "article/create", encodeImage)
}

export const generateUpdateArticleBody = async (
  publicationId: string,
  form: UpdateArticleFormSchema,
  encodeImage: (file: File) => Promise<string | undefined>,
) => {
  return processArticleBody(publicationId, form, "article/update", encodeImage)
}

export const deleteArticleBody = async (id: string) => {
  return {
    action: "article/delete",
    id,
  }
}

import { IpfsFunctions } from "../hooks/useIpfs"
import { Article } from "../models/publication"

// utils/modifyHTML.ts
export function removeHashPrefixFromImages(articleHTML: string): string {
  // Parse HTML to DOM document
  let doc = new DOMParser().parseFromString(articleHTML, "text/html")

  // Get all img elements and replace their src
  let images = Array.from(doc.getElementsByTagName("img"))
  for (let img of images) {
    img.src = img.src.replace(/.*\/(.*)$/, "$1")
  }

  // Serialize DOM document to HTML string
  let modifiedHTMLString = Array.from(doc.body.childNodes)
    .map((node) => new XMLSerializer().serializeToString(node))
    .join("")

  return modifiedHTMLString
}

// utils/articleUtils.ts

export const processArticleContent = (
  article: Article,
  ipfs: IpfsFunctions,
): Promise<{ img: string | null; content: string | null | undefined; modifiedHTMLString: string | undefined }> => {
  const { image: thumbnailImg, article: articleContent } = article
  let modifiedHTMLString: string | undefined = undefined
  const imgPromise: Promise<string | null> = thumbnailImg ? ipfs.getImgSrc(thumbnailImg) : Promise.resolve(null)
  const contentPromise: Promise<string | null | undefined> = articleContent
    ? ipfs.getText(articleContent).then((content) => {
        if (content) {
          return content
        }
      })
    : Promise.resolve(null)

  return Promise.all([imgPromise, contentPromise]).then(async ([img, content]) => {
    if (content) {
      let parser = new DOMParser()
      let doc = parser.parseFromString(content, "text/html")
      let images = Array.from(doc.getElementsByTagName("img"))
      for (let img of images) {
        let hash = img.src.replace(/.*\/(.*)$/, "$1")
        img.src = await ipfs.getImgSrc(hash)
      }
      modifiedHTMLString = doc.body.innerHTML
    }
    return { img, content, modifiedHTMLString }
  })
}

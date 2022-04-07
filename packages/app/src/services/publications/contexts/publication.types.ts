import { ReactNode } from "react"
import { Article, Publications } from "../../../models/publication"

export type PublicationContextType = {
  publication: Publications | undefined
  publications: Publications[] | undefined
  draftArticle: Article | undefined
  article: Article | undefined
  saveDraftArticle: (article: Article) => void
  savePublication: (publication: Publications | undefined) => void
  savePublications: (publications: Publications[] | undefined) => void
  saveArticle: (article: Article) => void
}

export type PublicationProviderProps = {
  children: ReactNode
}

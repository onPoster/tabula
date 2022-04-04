import { ReactNode } from "react"
import { Article, Publications } from "../../../models/publication"

export type PublicationContextType = {
  publication: Publications | undefined
  publications: Publications[] | undefined
  draftArticle: Article | undefined
  fetchPublications: () => void
  fetchPublication: (id: string) => void
  saveDraftArticle: (article: Article) => void
}

export type PublicationProviderProps = {
  children: ReactNode
}

import { ReactNode } from "react"
import { Article, Permission, Publications } from "../../../models/publication"

export type PublicationContextType = {
  publication: Publications | undefined
  publications: Publications[] | undefined
  draftArticle: Article | undefined
  article: Article | undefined
  permission: Permission | undefined
  editingPublication: boolean
  draftPublicationImage: File | undefined
  currentPath: string | undefined
  markdownArticle: string | undefined
  loading: boolean
  getPinnedData: (hash: string) => void
  setMarkdownArticle: (markdown: string | undefined) => void
  saveIsEditing: (isEditing: boolean) => void
  saveDraftPublicationImage: (file: File | undefined) => void
  setCurrentPath: (path: string | undefined) => void
  savePermission: (permission: Permission) => void
  saveDraftArticle: (article: Article | undefined) => void
  savePublication: (publication: Publications | undefined) => void
  savePublications: (publications: Publications[] | undefined) => void
  saveArticle: (article: Article | undefined) => void
}

export type PublicationProviderProps = {
  children: ReactNode
}

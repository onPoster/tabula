import { ethers } from "ethers"
import { ReactNode } from "react"
import { Article, Permission, Publication } from "../../../models/publication"

export type PublicationContextType = {
  publication: Publication | undefined
  publications: Publication[] | undefined
  draftArticle: Article | undefined
  article: Article | undefined
  permission: Permission | undefined
  editingPublication: boolean
  draftPublicationImage: File | undefined
  currentPath: string | undefined
  markdownArticle: string | undefined
  loading: boolean
  publicationAvatar: { publicationId: string; uri: string } | undefined
  setPublicationAvatar: (uri: { publicationId: string; uri: string } | undefined) => void
  getIpfsData: (hash: string) => void
  getPublicationId: (publicationSlug: string, provider?: ethers.providers.BaseProvider) => Promise<string | undefined>
  setMarkdownArticle: (markdown: string | undefined) => void
  saveIsEditing: (isEditing: boolean) => void
  saveDraftPublicationImage: (file: File | undefined) => void
  setCurrentPath: (path: string | undefined) => void
  savePermission: (permission: Permission) => void
  saveDraftArticle: (article: Article | undefined) => void
  savePublication: (publication: Publication | undefined) => void
  savePublications: (publications: Publication[] | undefined) => void
  saveArticle: (article: Article | undefined) => void
}

export type PublicationProviderProps = {
  children: ReactNode
}

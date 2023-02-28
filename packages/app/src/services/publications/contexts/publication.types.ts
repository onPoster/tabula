import { ethers } from "ethers"
import { ReactNode } from "react"
import { Block } from "../../../components/commons/EditableItemBlock"
import { Article, Permission, Publications } from "../../../models/publication"

export type PublicationContextType = {
  publication: Publications | undefined
  publications: Publications[] | undefined
  draftArticle: Article | undefined
  article: Article | undefined
  articleContent: Block[]
  permission: Permission | undefined
  editingPublication: boolean
  draftPublicationImage: File | undefined
  draftArticleThumbnail: File | undefined
  currentPath: string | undefined
  markdownArticle: string | undefined
  loading: boolean
  ipfsLoading: boolean
  isEditing: boolean
  executeArticleTransaction: boolean
  setIsEditing: (editing: boolean) => void
  setLoading: (loading: boolean) => void
  setIpfsLoading: (loading: boolean) => void
  setExecuteArticleTransaction: (execute: boolean) => void
  getIpfsData: (hash: string) => Promise<string>
  getPublicationId: (publicationSlug: string, provider?: ethers.providers.BaseProvider) => Promise<string | undefined>
  setMarkdownArticle: (markdown: string | undefined) => void
  saveIsEditing: (isEditing: boolean) => void
  saveDraftPublicationImage: (file: File | undefined) => void
  setDraftArticleThumbnail: (file: File | undefined) => void
  setCurrentPath: (path: string | undefined) => void
  savePermission: (permission: Permission) => void
  saveDraftArticle: (article: Article | undefined) => void
  savePublication: (publication: Publications | undefined) => void
  savePublications: (publications: Publications[] | undefined) => void
  saveArticle: (article: Article | undefined) => void
  setArticleContent: (content: Block[]) => void
}

export type PublicationProviderProps = {
  children: ReactNode
}

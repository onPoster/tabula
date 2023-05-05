import { ethers } from "ethers"
import { ReactNode } from "react"
import { Permission, Publication } from "../../../models/publication"

export type PublicationContextType = {
  publication: Publication | undefined
  publications: Publication[] | undefined
  permission: Permission | undefined
  draftPublicationImage: File | undefined
  currentPath: string | undefined
  loading: boolean
  ipfsLoading: boolean
  setLoading: (loading: boolean) => void
  setIpfsLoading: (loading: boolean) => void
  publicationAvatar: { publicationId: string; uri: string } | undefined
  setPublicationAvatar: (uri: { publicationId: string; uri: string } | undefined) => void
  removePublicationImage: boolean
  setRemovePublicationImage: (remove: boolean) => void
  getPublicationId: (publicationSlug: string, provider?: ethers.providers.BaseProvider) => Promise<string | undefined>
  editingPublication: boolean
  saveIsEditingPublication: (isEditing: boolean) => void
  saveDraftPublicationImage: (file: File | undefined) => void
  setCurrentPath: (path: string | undefined) => void
  savePermission: (permission: Permission) => void
  savePublication: (publication: Publication | undefined) => void
  savePublications: (publications: Publication[] | undefined) => void
}

export type PublicationProviderProps = {
  children: ReactNode
}

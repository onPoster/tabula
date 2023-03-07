import { ethers } from "ethers"
import { useState } from "react"
import { useIpfs } from "../../../hooks/useIpfs"
import { Article, Permission, Publication } from "../../../models/publication"
import { createGenericContext } from "../../../utils/create-generic-context"
import { getTextRecordContent } from "../../ens"

import { PublicationContextType, PublicationProviderProps } from "./publication.types"

const [usePublicationContext, PublicationContextProvider] = createGenericContext<PublicationContextType>()

const PublicationProvider = ({ children }: PublicationProviderProps) => {
  const [currentPath, setCurrentPath] = useState<string | undefined>(undefined)
  const [publications, setPublications] = useState<Publication[] | undefined>(undefined)
  const [publication, setPublication] = useState<Publication | undefined>(undefined)
  const [draftArticle, setDraftArticle] = useState<Article | undefined>(undefined)
  const [article, setArticle] = useState<Article | undefined>(undefined)
  const [permission, setPermission] = useState<Permission | undefined>(undefined)
  const [editingPublication, setEditingPublication] = useState<boolean>(false)
  const [draftPublicationImage, setDraftPublicationImage] = useState<File | undefined>(undefined)
  const [markdownArticle, setMarkdownArticle] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)
  const ipfs = useIpfs()
  const [slugToPublicationId, setSlugToPublicationId] = useState<{ [key: string]: string }>({})
  const [publicationAvatar, setPublicationAvatar] = useState<{ publicationId: string; uri: string } | undefined>(
    undefined,
  )
  const [removePublicationImage, setRemovePublicationImage] = useState<boolean>(false)

  const getPublicationId = async (publicationSlug: string, provider?: ethers.providers.BaseProvider) => {
    if (slugToPublicationId[publicationSlug]) {
      return slugToPublicationId[publicationSlug]
    } else {
      if (publicationSlug.endsWith(".eth")) {
        const publicationId = await getTextRecordContent(publicationSlug, "tabula", provider)
        if (publicationId) {
          setSlugToPublicationId((prev) => {
            prev[publicationSlug] = publicationId
            return prev
          })
          return publicationId
        }
      } else {
        setSlugToPublicationId((prev) => {
          prev[publicationSlug] = publicationSlug
          return prev
        })
        return publicationSlug
      }
    }
  }

  const getIpfsData = async (hash: string) => {
    setLoading(true)
    const data = await ipfs.getText(hash)
    if (data != null) {
      setMarkdownArticle(data)
    }
    setLoading(false)
  }
  const savePublication = (publication: Publication | undefined) => setPublication(publication)
  const savePublications = (publications: Publication[] | undefined) => setPublications(publications)
  const saveDraftArticle = (article: Article | undefined) => setDraftArticle(article)
  const saveArticle = (article: Article | undefined) => setArticle(article)
  const savePermission = (permission: Permission) => setPermission(permission)
  const saveIsEditing = (isEditing: boolean) => setEditingPublication(isEditing)
  const saveDraftPublicationImage = (file: File | undefined) => setDraftPublicationImage(file)

  return (
    <PublicationContextProvider
      value={{
        publication,
        publications,
        draftArticle,
        article,
        permission,
        editingPublication,
        draftPublicationImage,
        currentPath,
        markdownArticle,
        loading,
        publicationAvatar,
        removePublicationImage,
        setRemovePublicationImage,
        setPublicationAvatar,
        setMarkdownArticle,
        getIpfsData,
        getPublicationId,
        setCurrentPath,
        saveIsEditing,
        saveDraftPublicationImage,
        savePermission,
        savePublication,
        savePublications,
        saveArticle,
        saveDraftArticle,
      }}
    >
      {children}
    </PublicationContextProvider>
  )
}

export { usePublicationContext, PublicationProvider }

import { useState } from "react"
import useHttp from "../../../hooks/useHttp"
import { Article, Permission, Publications } from "../../../models/publication"
import { createGenericContext } from "../../../utils/create-generic-context"
import ipfsService from "../../ipfs/ipfs"

import { PublicationContextType, PublicationProviderProps } from "./publication.types"

const [usePublicationContext, PublicationContextProvider] = createGenericContext<PublicationContextType>()

const PublicationProvider = ({ children }: PublicationProviderProps) => {
  const [currentPath, setCurrentPath] = useState<string | undefined>(undefined)
  const [publications, setPublications] = useState<Publications[] | undefined>(undefined)
  const [publication, setPublication] = useState<Publications | undefined>(undefined)
  const [draftArticle, setDraftArticle] = useState<Article | undefined>(undefined)
  const [article, setArticle] = useState<Article | undefined>(undefined)
  const [permission, setPermission] = useState<Permission | undefined>(undefined)
  const [editingPublication, setEditingPublication] = useState<boolean>(false)
  const [draftPublicationImage, setDraftPublicationImage] = useState<File | undefined>(undefined)
  const [markdownArticle, setMarkdownArticle] = useState<string | undefined>(undefined)

  const [getPinnedRequest, { loading }] = useHttp(ipfsService.getData)

  const getPinnedData = async (hash: string) => {
    const data = await getPinnedRequest(hash)
    setMarkdownArticle(data)
  }
  const savePublication = (publication: Publications | undefined) => setPublication(publication)
  const savePublications = (publications: Publications[] | undefined) => setPublications(publications)
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
        setMarkdownArticle,
        getPinnedData,
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

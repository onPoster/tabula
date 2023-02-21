import { ethers } from "ethers"
import { useState } from "react"
import { Block } from "../../../components/commons/EditableItemBlock"
import { useIpfs } from "../../../hooks/useIpfs"
import { Article, Permission, Publications } from "../../../models/publication"
import { createGenericContext } from "../../../utils/create-generic-context"
import { getTextRecordContent } from "../../ens"

import { PublicationContextType, PublicationProviderProps } from "./publication.types"

export const INITIAL_ARTICLE_VALUE = { title: "", article: "" }
const [usePublicationContext, PublicationContextProvider] = createGenericContext<PublicationContextType>()

const PublicationProvider = ({ children }: PublicationProviderProps) => {
  const [currentPath, setCurrentPath] = useState<string | undefined>(undefined)
  const [publications, setPublications] = useState<Publications[] | undefined>(undefined)
  const [publication, setPublication] = useState<Publications | undefined>(undefined)
  const [draftArticle, setDraftArticle] = useState<Article | undefined>(INITIAL_ARTICLE_VALUE)
  const [article, setArticle] = useState<Article | undefined>(undefined)
  const [articleContent, setArticleContent] = useState<Block[] | undefined>(undefined)
  const [permission, setPermission] = useState<Permission | undefined>(undefined)
  const [editingPublication, setEditingPublication] = useState<boolean>(false)
  const [executeArticleTransaction, setExecuteArticleTransaction] = useState<boolean>(false)
  const [draftPublicationImage, setDraftPublicationImage] = useState<File | undefined>(undefined)
  const [draftArticleThumbnail, setDraftArticleThumbnail] = useState<File | undefined>(undefined)
  const [markdownArticle, setMarkdownArticle] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)
  const [ipfsLoading, setIpfsLoading] = useState<boolean>(false)
  const ipfs = useIpfs()
  const [slugToPublicationId, setSlugToPublicationId] = useState<{ [key: string]: string }>({})

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

  const getIpfsData = async (hash: string): Promise<string> => {
    setIpfsLoading(true)
    const data = await ipfs.getText(hash)
  
    if (data != null) {
      setMarkdownArticle(data)
    }
    setIpfsLoading(false)
    return data
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
        articleContent,
        permission,
        editingPublication,
        draftPublicationImage,
        currentPath,
        markdownArticle,
        loading,
        executeArticleTransaction,
        draftArticleThumbnail,
        ipfsLoading,
        setIpfsLoading,
        setLoading,
        setDraftArticleThumbnail,
        setExecuteArticleTransaction,
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
        setArticleContent,
      }}
    >
      {children}
    </PublicationContextProvider>
  )
}

export { usePublicationContext, PublicationProvider }

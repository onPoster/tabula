import { ethers } from "ethers"
import { useState } from "react"
import { Permission, Publication } from "../../../models/publication"
import { createGenericContext } from "../../../utils/create-generic-context"
import { PublicationContextType, PublicationProviderProps } from "./publication.types"
import useENS from "../../ens/hooks/useENS"

const [usePublicationContext, PublicationContextProvider] = createGenericContext<PublicationContextType>()

const PublicationProvider = ({ children }: PublicationProviderProps) => {
  const { getTextRecordContent } = useENS()
  const [currentPath, setCurrentPath] = useState<string | undefined>(undefined)
  const [publications, setPublications] = useState<Publication[] | undefined>(undefined)
  const [publication, setPublication] = useState<Publication | undefined>(undefined)
  const [permission, setPermission] = useState<Permission | undefined>(undefined)
  const [editingPublication, setEditingPublication] = useState<boolean>(false)
  const [draftPublicationImage, setDraftPublicationImage] = useState<File | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)
  const [ipfsLoading, setIpfsLoading] = useState<boolean>(false)
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

  const savePublication = (publication: Publication | undefined) => setPublication(publication)
  const savePublications = (publications: Publication[] | undefined) => setPublications(publications)
  const savePermission = (permission: Permission) => setPermission(permission)
  const saveIsEditingPublication = (isEditing: boolean) => setEditingPublication(isEditing)
  const saveDraftPublicationImage = (file: File | undefined) => setDraftPublicationImage(file)

  return (
    <PublicationContextProvider
      value={{
        publication,
        publications,
        permission,
        editingPublication,
        draftPublicationImage,
        currentPath,
        loading,
        ipfsLoading,
        publicationAvatar,
        removePublicationImage,
        setIpfsLoading,
        setLoading,
        setRemovePublicationImage,
        setPublicationAvatar,
        getPublicationId,
        setCurrentPath,
        saveIsEditingPublication,
        saveDraftPublicationImage,
        savePermission,
        savePublication,
        savePublications,
      }}
    >
      {children}
    </PublicationContextProvider>
  )
}

export { usePublicationContext, PublicationProvider }

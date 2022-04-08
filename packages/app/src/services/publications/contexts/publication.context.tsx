import { useState } from "react"
import { Article, Publications } from "../../../models/publication"
import { createGenericContext } from "../../../utils/create-generic-context"
import { getPublication, getPublications } from "../service"

import { PublicationContextType, PublicationProviderProps } from "./publication.types"

const [usePublicationContext, PublicationContextProvider] = createGenericContext<PublicationContextType>()

const PublicationProvider = ({ children }: PublicationProviderProps) => {
  const [publications, setPublications] = useState<Publications[] | undefined>(undefined)
  const [publication, setPublication] = useState<Publications | undefined>(undefined)
  const [draftArticle, setDraftArticle] = useState<Article | undefined>(undefined)

  const fetchPublications = async () => {
    const data = await getPublications()
    setPublications(data)
  }

  const fetchPublication = async (id: string) => {
    const data = await getPublication(id)
    setPublication(data)
  }
  const saveDraftArticle = (article: Article) => setDraftArticle(article)

  return (
    <PublicationContextProvider
      value={{
        publication,
        publications,
        draftArticle,
        saveDraftArticle,
        fetchPublications,
        fetchPublication,
      }}
    >
      {children}
    </PublicationContextProvider>
  )
}

export { usePublicationContext, PublicationProvider }

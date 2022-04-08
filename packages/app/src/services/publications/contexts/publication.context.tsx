import { useState } from "react"
import { Article, Publications } from "../../../models/publication"
import { createGenericContext } from "../../../utils/create-generic-context"

import { PublicationContextType, PublicationProviderProps } from "./publication.types"

const [usePublicationContext, PublicationContextProvider] = createGenericContext<PublicationContextType>()

const PublicationProvider = ({ children }: PublicationProviderProps) => {
  const [publications, setPublications] = useState<Publications[] | undefined>(undefined)
  const [publication, setPublication] = useState<Publications | undefined>(undefined)
  const [draftArticle, setDraftArticle] = useState<Article | undefined>(undefined)
  const [article, setArticle] = useState<Article | undefined>(undefined)

  const savePublication = (publication: Publications | undefined) => setPublication(publication)
  const savePublications = (publications: Publications[] | undefined) => setPublications(publications)
  const saveDraftArticle = (article: Article) => setDraftArticle(article)
  const saveArticle = (article: Article) => setArticle(article)

  return (
    <PublicationContextProvider
      value={{
        publication,
        publications,
        draftArticle,
        article,
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

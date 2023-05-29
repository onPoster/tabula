import { useCallback, useState } from "react"
import { useIpfs } from "../../../hooks/useIpfs"
import { Article } from "../../../models/publication"
import { createGenericContext } from "../../../utils/create-generic-context"

import { ArticleContextType, ArticleProviderProps } from "./article.types"
import { uid } from "uid"

export const INITIAL_ARTICLE_VALUE = { title: "", article: "" }
export const INITIAL_ARTICLE_BLOCK = [{ id: uid(), html: "", tag: "p" }]
const [useArticleContext, ArticleContextProvider] = createGenericContext<ArticleContextType>()

const ArticleProvider = ({ children }: ArticleProviderProps) => {
  const ipfs = useIpfs()
  const [currentPath, setCurrentPath] = useState<string | undefined>(undefined)
  const [draftArticle, setDraftArticle] = useState<Article | undefined>(INITIAL_ARTICLE_VALUE)
  const [article, setArticle] = useState<Article | undefined>(undefined)

  const [executeArticleTransaction, setExecuteArticleTransaction] = useState<boolean>(false)
  const [draftArticleThumbnail, setDraftArticleThumbnail] = useState<File | undefined>(undefined)
  const [markdownArticle, setMarkdownArticle] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)
  const [ipfsLoading, setIpfsLoading] = useState<boolean>(false)
  const [removePublicationImage, setRemovePublicationImage] = useState<boolean>(false)
  const [articleTitleError, setArticleTitleError] = useState<boolean>(false)
  const [articleContentError, setArticleContentError] = useState<boolean>(false)

  /** EditorBlock States V2 **/
  const [storeArticleContent, setStoreArticleContent] = useState<boolean>(false)
  const [draftArticlePath, setDraftArticlePath] = useState<string | undefined>(undefined)
  const [articleEditorState, setArticleEditorState] = useState<string | undefined>()
  const [showBlockTypePopup, setShowBlockTypePopup] = useState<boolean>(false)
  const [publishArticle, setPublishArticle] = useState<boolean>(false)
  const [linkComponentUrl, setLinkComponentUrl] = useState<string | undefined>(undefined)

  // const logState = () => {
  //   const content = editorState.getCurrentContent()
  //   console.log(convertToRaw(content))
  // }

  // const convertFromHtml = (html: string) => {
  //   const contentState = stateFromHTML(html)
  //   setEditorState(EditorState.createWithContent(contentState))
  // }

  const clearArticleState = () => {
    setCurrentPath(undefined)
    setDraftArticle(undefined)
    setArticle(INITIAL_ARTICLE_VALUE)

    setExecuteArticleTransaction(false)
    setDraftArticleThumbnail(undefined)
    setMarkdownArticle(undefined)
    setLoading(false)
    setIpfsLoading(false)
    setArticleTitleError(false)
    setArticleContentError(false)
    setArticleEditorState(undefined)
    setLinkComponentUrl(undefined)
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

  const updateDraftArticle = useCallback((key: string, value: string | string[] | null) => {
    setDraftArticle((prevState: Article | undefined) => {
      if (!prevState) {
        return undefined
      }
      return { ...prevState, [key]: value } as Article
    })
  }, [])

  const saveDraftArticle = (article: Article | undefined) => setDraftArticle(article)
  const saveArticle = (article: Article | undefined) => setArticle(article)

  return (
    <ArticleContextProvider
      value={{
        draftArticle,
        article,
        currentPath,
        markdownArticle,
        loading,
        executeArticleTransaction,
        draftArticleThumbnail,
        ipfsLoading,
        removePublicationImage,
        articleTitleError,
        articleContentError,
        articleEditorState,
        publishArticle,
        showBlockTypePopup,
        storeArticleContent,
        draftArticlePath,
        linkComponentUrl,
        setPublishArticle,
        setLinkComponentUrl,
        setDraftArticlePath,
        setStoreArticleContent,
        setShowBlockTypePopup,
        setArticleEditorState,
        setIpfsLoading,
        setLoading,
        setDraftArticleThumbnail,
        setExecuteArticleTransaction,
        setArticleTitleError,
        setArticleContentError,
        setRemovePublicationImage,
        setMarkdownArticle,
        getIpfsData,
        setCurrentPath,
        saveArticle,
        saveDraftArticle,
        updateDraftArticle,
        clearArticleState,
      }}
    >
      {children}
    </ArticleContextProvider>
  )
}

export { useArticleContext, ArticleProvider }

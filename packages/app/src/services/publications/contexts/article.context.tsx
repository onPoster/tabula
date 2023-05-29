import { useCallback, useState } from "react"
import { Block } from "../../../components/commons/EditableItemBlock"
import { useIpfs } from "../../../hooks/useIpfs"
import { Article } from "../../../models/publication"
import { createGenericContext } from "../../../utils/create-generic-context"

import { ArticleContextType, ArticleProviderProps } from "./article.types"
import { findIndex } from "lodash"
import { uid } from "uid"

export const INITIAL_ARTICLE_VALUE = { title: "", article: "" }
export const INITIAL_ARTICLE_BLOCK = [{ id: uid(), html: "", tag: "p" }]
const [useArticleContext, ArticleContextProvider] = createGenericContext<ArticleContextType>()

const ArticleProvider = ({ children }: ArticleProviderProps) => {
  const ipfs = useIpfs()
  const [currentPath, setCurrentPath] = useState<string | undefined>(undefined)
  const [draftArticle, setDraftArticle] = useState<Article | undefined>(INITIAL_ARTICLE_VALUE)
  const [article, setArticle] = useState<Article | undefined>(undefined)
  const [articleContent, setArticleContent] = useState<Block[]>(INITIAL_ARTICLE_BLOCK)
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
    setArticleContent(INITIAL_ARTICLE_BLOCK)
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

  const updateArticleContent = useCallback((blockId: string, value: string) => {
    setArticleContent((prevItems) => {
      const itemIndex = findIndex(prevItems, { id: blockId })
      const updatedItem = { ...prevItems[itemIndex], html: value }
      return [...prevItems.slice(0, itemIndex), updatedItem, ...prevItems.slice(itemIndex + 1)]
    })
  }, [])

  const addNewBlock = useCallback((block: { id: string }, newId: string, customBlocks?: Block[]) => {
    setArticleContent((prevItems) => {
      const newBlock = { id: newId, html: "", tag: "p" }
      const currentBlocks = customBlocks ? customBlocks : [...prevItems]
      const index = findIndex(currentBlocks, { id: block.id })
      const updatedBlocks = [...currentBlocks.slice(0, index + 1), newBlock, ...currentBlocks.slice(index + 1)]
      return updatedBlocks
    })
  }, [])

  const setCaretToEnd = useCallback((element: HTMLElement) => {
    const range = document.createRange()
    const selection = window.getSelection()
    range.selectNodeContents(element)
    range.collapse(false)
    if (selection) {
      selection.removeAllRanges()
      selection.addRange(range)
    }
    element.focus()
  }, [])

  const deleteBlock = useCallback(
    (block: { id: string; index: number }) => {
      if (block.index) {
        const previousBlockPosition = articleContent[block.index - 1]
        const previousBlock = document.getElementById(previousBlockPosition.id)
        const currentBlocks = [...articleContent]
        const newBlocks = currentBlocks.filter((b) => b.id !== block.id)
        setArticleContent(newBlocks)
        if (previousBlock) {
          setCaretToEnd(previousBlock)
          previousBlock.focus()
        }
      }
    },
    [articleContent, setArticleContent, setCaretToEnd],
  )

  const saveDraftArticle = (article: Article | undefined) => setDraftArticle(article)
  const saveArticle = (article: Article | undefined) => setArticle(article)

  return (
    <ArticleContextProvider
      value={{
        draftArticle,
        article,
        articleContent,
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
        setPublishArticle,
        showBlockTypePopup,
        storeArticleContent,
        draftArticlePath,
        linkComponentUrl,
        setLinkComponentUrl,
        setDraftArticlePath,
        setStoreArticleContent,
        setShowBlockTypePopup,
        setArticleEditorState,
        updateArticleContent,
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
        setArticleContent,
        addNewBlock,
        deleteBlock,
        updateDraftArticle,
        clearArticleState,
      }}
    >
      {children}
    </ArticleContextProvider>
  )
}

export { useArticleContext, ArticleProvider }

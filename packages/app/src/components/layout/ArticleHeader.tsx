/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react"
import { Button, CircularProgress, Grid, Stack, Typography } from "@mui/material"
import { useWeb3React } from "@web3-react/core"
import { WalletBadge } from "../commons/WalletBadge"
import { Article, Publication } from "../../models/publication"
import { palette, typography } from "../../theme"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import usePublication from "../../services/publications/hooks/usePublication"
import { INITIAL_ARTICLE_VALUE, useArticleContext, usePublicationContext } from "../../services/publications/contexts"
import { UserOptions } from "../commons/UserOptions"
import Avatar from "../commons/Avatar"
// import { useOnClickOutside } from "../../hooks/useOnClickOutside"
import { useIpfs } from "../../hooks/useIpfs"
import useLocalStorage from "../../hooks/useLocalStorage"
import { Pinning } from "../../models/pinning"
import useArticles from "../../services/publications/hooks/useArticles"
import usePoster from "../../services/poster/hooks/usePoster"
import useArticle from "../../services/publications/hooks/useArticle"
import { removeHashPrefixFromImages } from "../../utils/modifyHTML"

type Props = {
  publication?: Publication
  type: "edit" | "new"
}

const ArticleHeader: React.FC<Props> = ({ publication, type }) => {
  const { publicationSlug } = useParams<{ publicationSlug: string }>()
  const { account, active } = useWeb3React()
  const navigate = useNavigate()
  const location = useLocation()
  const ipfs = useIpfs()
  const [publicationId, setPublicationId] = useState<string>("")
  const [pinning] = useLocalStorage<Pinning | undefined>("pinning", undefined)
  const { createArticle, updateArticle } = usePoster()
  const { setCurrentPath, loading: loadingTransaction, ipfsLoading, setLoading } = usePublicationContext()

  const {
    setExecuteArticleTransaction,
    saveDraftArticle,
    draftArticle,
    clearArticleState,
    draftArticleThumbnail,
    setArticleTitleError,
    setArticleContentError,
    setStoreArticleContent,
    setDraftArticlePath,
    articleEditorState,
    contentImageFiles,
  } = useArticleContext()

  const {
    indexing: createArticleIndexing,
    setExecutePollInterval: createPoll,
    transactionCompleted: newArticleTransaction,
    newArticleId,
  } = useArticles()
  const {
    indexing: updateArticleIndexing,
    setExecutePollInterval: updatePoll,
    transactionCompleted: updateTransaction,
    newArticleId: updateArticleId,
    setArticleId,
    setCurrentTimestamp,
  } = useArticle(draftArticle?.id ?? "")
  const {
    refetch,
    chainId: publicationChainId,
    transactionCompleted,
  } = usePublication(publicationSlug || publication?.id || "")
  const [show, setShow] = useState<boolean>(false)
  const [prepareArticleTransaction, setPrepareArticleTransaction] = useState<boolean>(false)
  const isPreview = location.pathname.includes("preview")
  const ref = useRef<HTMLDivElement | null>(null)

  // useOnClickOutside(ref, () => {
  //   if (show) {
  //     setShow(!show)
  //   }
  // })

  /**
   * Logic after complete the transaction
   */
  useEffect(() => {
    if (transactionCompleted) {
      saveDraftArticle(INITIAL_ARTICLE_VALUE)
      navigate(-1)
    }
  }, [navigate, saveDraftArticle, transactionCompleted])

  useEffect(() => {
    if (location.pathname) {
      setCurrentPath(location.pathname)
    }
  }, [location, setCurrentPath])

  useEffect(() => {
    if ((newArticleTransaction || updateTransaction) && publicationSlug) {
      setLoading(false)
      navigate(`/${publicationSlug ?? publication?.id ?? publicationId}/${newArticleId || updateArticleId}`)
    }
  }, [
    navigate,
    newArticleId,
    newArticleTransaction,
    publication,
    publicationSlug,
    setLoading,
    updateArticleId,
    updateTransaction,
  ])

  useEffect(() => {
    const execute = async () => {
      await prepareTransaction()
    }
    if (prepareArticleTransaction && articleEditorState) {
      execute()
    }
  }, [prepareArticleTransaction, articleEditorState])

  const handleNavigation = async () => {
    refetch()
    clearArticleState()
    navigate(`/${publicationSlug}`)
  }

  const handlePreview = () => {
    if (isPreview) {
      navigate(-1)
      setDraftArticlePath(undefined)
    } else {
      setStoreArticleContent(true)
      setDraftArticlePath(`../${type}/preview`)
    }
  }

  //V2
  const prepareTransaction = async () => {
    let initialError = false
    if (draftArticle?.title === "") {
      setExecuteArticleTransaction(false)
      setArticleTitleError(true)
      initialError = true
    }
    if (!articleEditorState) {
      initialError = true
    }
    if (initialError) {
      return
    }
    setArticleTitleError(false)
    setArticleContentError(false)
    setLoading(true)
    let articleContent = ""
    if (contentImageFiles) {
      const articleWithHash = removeHashPrefixFromImages(articleEditorState as string)
      const parser = new DOMParser()
      let doc = parser.parseFromString(articleWithHash as string, "text/html")
      let imgs = Array.from(doc.getElementsByTagName("img"))
      for (const img of imgs) {
        let altValue = img.alt
        let file = contentImageFiles.find((file: File) => file.lastModified.toString() === altValue)
        if (file) {
          let hash = await ipfs.uploadContent(file).then((hash) => hash.path)
          img.src = hash
        }
      }

      let newDoc = parser.parseFromString(doc.body.innerHTML, "text/html")
      let modifiedHTMLString = newDoc.body.innerHTML
      articleContent = modifiedHTMLString
    }

    if (!contentImageFiles && articleEditorState?.includes("img")) {
      articleContent = removeHashPrefixFromImages(articleEditorState)
    }
    if (draftArticle) {
      const newArticle = {
        ...draftArticle,
        article: articleContent as string,
      }

      await handleArticleAction(newArticle)
    }
    setLoading(false)
    setExecuteArticleTransaction(false)
  }

  const handleArticleAction = async (article: Article) => {
    let articleThumbnail = ""
    let hashArticle
    const { title, article: draftArticleText, description, tags } = article
    if (draftArticleThumbnail) {
      await ipfs.uploadContent(draftArticleThumbnail).then(async (img) => {
        articleThumbnail = img.path
      })
    }

    if (article && (publication || article.publication) && account) {
      setPublicationId(article.publication?.id ?? "")
      const id = publication?.id || article.publication?.id

      if (id == null) {
        throw new Error("Publication id is null")
      }
      if (pinning && draftArticleText) {
        hashArticle = await ipfs.uploadContent(draftArticleText)
      }

      if (title) {
        if (type === "new") {
          console.log("before start")
          return await createArticle(
            {
              action: "article/create",
              publicationId: id,
              title,
              article: hashArticle ? hashArticle.path : draftArticleText,
              description,
              tags,
              image: articleThumbnail,
              authors: [account],
            },
            hashArticle ? true : false,
          ).then((res) => {
            console.log("response of the create article", res)
            if (res?.error) {
              setLoading(false)
            } else {
              createPoll(true)
            }
          })
        }
        if (type === "edit" && article && article.id && article.lastUpdated) {
          setCurrentTimestamp(parseInt(article.lastUpdated))
          await updateArticle(
            {
              action: "article/update",
              id: article.id,
              title,
              article: hashArticle ? hashArticle.path : draftArticleText,
              description,
              tags,
              image: articleThumbnail,
            },
            hashArticle ? true : false,
          ).then((res) => {
            if (res && res.error) {
              setLoading(false)
            } else if (article && article.lastUpdated) {
              setArticleId(article.id)
              updatePoll(true)
            }
          })
        }
      }
      return
    }
    setLoading(false)
  }

  return (
    <Stack
      component="header"
      direction="row"
      spacing={2}
      sx={{
        alignItems: "center",
        justifyContent: publication ? "space-between" : "flex-end",
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        zIndex: 2,
        px: 3,
        height: 40,
        mt: 4,
      }}
    >
      {publication && (
        <Stack
          alignItems={"center"}
          spacing={0.5}
          direction="row"
          sx={{ cursor: "pointer", transition: "opacity 0.25s ease-in-out", "&:hover": { opacity: 0.6 } }}
          onClick={handleNavigation}
        >
          <Avatar width={31} height={31} publicationSlug={publicationSlug as string} />

          <Typography
            color={palette.grays[1000]}
            variant="h6"
            fontFamily={typography.fontFamilies.sans}
            sx={{ margin: 0 }}
          >
            {publication.title}
          </Typography>
        </Stack>
      )}

      <Stack
        spacing={3}
        direction="row"
        sx={{
          alignItems: "center",
        }}
      >
        <Stack direction="row" sx={{ alignItems: "center" }} spacing={1}>
          <Button variant="text" onClick={handlePreview} disabled={loadingTransaction || ipfsLoading}>
            {isPreview ? "Edit" : "Preview"}
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              setExecuteArticleTransaction(true)
              setStoreArticleContent(true)
              setPrepareArticleTransaction(true)
            }}
            sx={{ fontSize: 14, py: "2px", minWidth: "unset" }}
            disabled={loadingTransaction || ipfsLoading || createArticleIndexing || updateArticleIndexing}
          >
            {(loadingTransaction || createArticleIndexing || updateArticleIndexing) && (
              <CircularProgress size={20} sx={{ marginRight: 1 }} />
            )}
            {createArticleIndexing || updateArticleIndexing ? "Indexing..." : "Publish"}
          </Button>
        </Stack>
        {!active ? (
          <Button
            variant="outlined"
            sx={{
              color: "#000000",
              border: `2px solid ${palette.grays[400]}`,
              "&:hover": {
                backgroundColor: palette.grays[200],
                border: `2px solid ${palette.grays[400]}`,
                boxShadow: "0 4px rgba(0,0,0,0.1), inset 0 -4px 4px #97220100",
              },
            }}
            onClick={() => navigate(`/wallet?publicationChainId=${publicationChainId}`)}
          >
            Connect Wallet
          </Button>
        ) : (
          account && (
            <Grid
              container
              flexDirection="column"
              alignItems={"end"}
              justifyContent={"flex-end"}
              sx={{ position: "relative" }}
            >
              <Grid item sx={{ cursor: "pointer" }} onClick={() => setShow(!show)}>
                <WalletBadge hover address={account} />
              </Grid>

              {show && (
                <Grid item sx={{ position: "absolute", top: 45 }}>
                  <Stack ref={ref}>
                    <UserOptions />
                  </Stack>
                </Grid>
              )}
            </Grid>
          )
        )}
      </Stack>
    </Stack>
  )
}

export default ArticleHeader

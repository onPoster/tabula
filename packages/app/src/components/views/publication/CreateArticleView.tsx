/* eslint-disable react-hooks/exhaustive-deps */
import { Box, FormHelperText, Grid, InputLabel, Stack, TextField } from "@mui/material"

import React, { useEffect, useState } from "react"
import { INITIAL_ARTICLE_VALUE, usePublicationContext } from "../../../services/publications/contexts"
import { ViewContainer } from "../../commons/ViewContainer"
import CreateArticlePage from "../../layout/CreateArticlePage"
import { Article } from "../../../models/publication"
import { useNavigate, useParams } from "react-router-dom"
import { useWeb3React } from "@web3-react/core"
import usePoster from "../../../services/poster/hooks/usePoster"
import usePublication from "../../../services/publications/hooks/usePublication"

import { ArticleContentSection } from "./components/ArticleContentSection"

import { RICH_TEXT_ELEMENTS } from "../../commons/RichText"
import { useIpfs } from "../../../hooks/useIpfs"
import { Block } from "../../commons/EditableItemBlock"

import useLocalStorage from "../../../hooks/useLocalStorage"
import { Pinning } from "../../../models/pinning"
import { palette } from "../../../theme"
import { checkTag } from "../../../utils/string-handler"
import useMarkdown from "../../../hooks/useMarkdown"
import useArticles from "../../../services/publications/hooks/useArticles"

interface CreateArticleViewProps {
  type: "new" | "edit"
}

export const CreateArticleView: React.FC<CreateArticleViewProps> = ({ type }) => {
  const navigate = useNavigate()
  const { publicationSlug } = useParams<{ publicationSlug: string }>()
  const { account } = useWeb3React()

  const ipfs = useIpfs()
  const {
    publication,
    draftArticle,
    saveDraftArticle,
    articleContent,
    executeArticleTransaction,
    setExecuteArticleTransaction,
    draftArticleThumbnail,
    setLoading,
    article,
    setArticleContent,
    isEditing,
  } = usePublicationContext()
  const { transactionCompleted } = usePublication(publicationSlug || "")
  const [pinning] = useLocalStorage<Pinning | undefined>("pinning", undefined)
  const { createArticle, updateArticle } = usePoster()
  const {
    // indexing: createArticleIndexing,
    setExecutePollInterval: createPoll,
    transactionCompleted: newArticleTransaction,
    newArticleId,
  } = useArticles()
  const {
    // indexing: updateArticleIndexing,
    setExecutePollInterval: updatePoll,
    transactionCompleted: updateTransaction,
    newArticleId: updateArticleId,
    setArticleId,
    setCurrentTimestamp,
  } = useArticles()
  const { convertToHtml } = useMarkdown()
  const [titleError, setTitleError] = useState<boolean>(false)
  const [articleContentError, setArticleContentError] = useState<boolean>(false)

  /**
   */
  useEffect(() => {
    if (article && !isEditing) {
      const fetchCurrentArticle = async () => {
        const { image: thumbnailImg, article: articleContent } = article
        let img
        if (thumbnailImg) {
          img = await ipfs.getImgSrc(thumbnailImg)
        }
        const content = await ipfs.getText(articleContent)

        if (content) {
          const block = checkTag(content)
          console.log("block", block)
          if (block.length) {
            setArticleContent(block)
          }
        }
        saveDraftArticle({ ...article, image: img })
      }

      // call the function
      fetchCurrentArticle()
    }
  }, [article])

  /**
   * Execute transaction
   */
  useEffect(() => {
    const execute = async () => {
      if (!draftArticle && executeArticleTransaction) {
        setTitleError(true)
        setArticleContentError(true)
        setExecuteArticleTransaction(false)
        return
      }
      if (articleContent && executeArticleTransaction && draftArticle) {
        await prepareTransaction(articleContent)
      }
    }
    execute()
  }, [executeArticleTransaction, articleContent])

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
    if ((newArticleTransaction || updateTransaction) && publicationSlug) {
      setLoading(false)
      navigate(`/${publicationSlug}/${newArticleId || updateArticleId}`)
    }
  }, [navigate, newArticleId, newArticleTransaction, publicationSlug, updateArticleId, updateTransaction])

  const prepareTransaction = async (articleContent: Block[]) => {
    if (draftArticle?.title === "") {
      return setTitleError(true)
    }
    setLoading(true)
    const blocks: Block[] = []
    for (const block of articleContent) {
      if (block.tag === RICH_TEXT_ELEMENTS.IMAGE && block.imageFile) {
        try {
          await ipfs.uploadContent(block.imageFile).then(async (img) => {
            blocks.push({ ...block, imageUrl: img.path })
          })
        } catch {
          setLoading(false)
        }
      } else {
        blocks.push(block)
      }
    }

    //Validate if the article content exist
    if (blocks.length === 1) {
      const block = blocks[0].html
      if (block === "") {
        setLoading(false)
        return setArticleContentError(true)
      }
    }

    const content = await convertToHtml(blocks, false)
    console.log("prepare transaction content", content)

    if (draftArticle) {
      const newArticle = { ...draftArticle, article: content }
      saveDraftArticle(newArticle)
      await handleArticleAction(newArticle)
    }
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
    if (publication && article && account) {
      const id = publication.id
      if (id == null) {
        throw new Error("Publication id is null")
      }
      if (pinning && draftArticleText) {
        console.log("draftArticleText", draftArticleText)
        hashArticle = await ipfs.uploadContent(draftArticleText)
      }

      if (title) {
        if (type === "new") {
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
            if (res?.error) {
              setLoading(false)
            } else {
              createPoll(true)
            }
          })
        }
        if (type === "edit" && article && article.id) {
          await updateArticle(
            {
              action: "article/update",
              id: article.id,
              title,
              article: hashArticle ? hashArticle.path : draftArticleText,
              description,
              tags,
              image: articleThumbnail,
              authors: [account],
            },
            hashArticle ? true : false,
          ).then((res) => {
            if (res && res.error) {
              setLoading(false)
            } else if (article && article.lastUpdated) {
              setArticleId(article.id)
              setCurrentTimestamp(parseInt(article.lastUpdated))
              updatePoll(true)
            }
          })
        }
      }
    }
  }

  return (
    <CreateArticlePage publication={publication}>
      <Box
        component="form"
        sx={{ position: "relative", overflowY: "auto", overflowX: "hidden", width: "100%", height: "100vh" }}
      >
        <ViewContainer maxWidth="sm">
          <Grid container gap={4} flexDirection="column" my={12.5}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel>
                  title<span style={{ color: "#CA6303" }}>*</span>
                </InputLabel>
                <TextField
                  variant="standard"
                  value={draftArticle?.title}
                  onChange={(event) => draftArticle && saveDraftArticle({ ...draftArticle, title: event.target.value })}
                  InputProps={{ disableUnderline: true }}
                  sx={{ width: "100%", fontSize: 40 }}
                  placeholder="Post title"
                />

                {titleError && (
                  <FormHelperText sx={{ color: palette.secondary[1000], textTransform: "capitalize" }}>
                    Title is required
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel>
                  Article content<span style={{ color: "#CA6303" }}>*</span>
                </InputLabel>
                <ArticleContentSection />
                {articleContentError && (
                  <FormHelperText sx={{ color: palette.secondary[1000], textTransform: "capitalize" }}>
                    Article content is required
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
          </Grid>
        </ViewContainer>
      </Box>
    </CreateArticlePage>
  )
}

// const {
//   control,
//   handleSubmit,
//   setValue,
//   watch,
//   formState: { errors },
// } = useForm({
//   resolver: yupResolver(articleSchema),
//   defaultValues: draftArticle,
// })

// useEffect(() => {
//   if (type === "edit" && isValidHash && article && !draftArticle) {
//     const { title } = article
//     setValue("title", title)
//     if (!markdownArticle) {
//       getIpfsData(article.article)
//     }
//     if (markdownArticle) {
//       setValue("article", markdownArticle)
//     }
//   }
//   if (type === "edit" && !isValidHash && article && !draftArticle) {
//     const { title, article: articleDescription } = article
//     setValue("title", title)
//     setValue("article", articleDescription)
//   }
// }, [type, article, setValue, isValidHash, markdownArticle, getIpfsData, draftArticle])

// {
//   /* {type === "new" && (
//               <Grid item xs={12} mt={1}>
//                 <Grid container justifyContent={"space-between"}>
//                   <Button variant="outlined" size="large" onClick={goToPublication}>
//                     Cancel
//                   </Button>
//                   <Button variant="contained" size="large" type="submit">
//                     Publish
//                   </Button>
//                 </Grid>
//               </Grid>
//             )}
//             {type === "edit" && (
//               <Grid item xs={12} mt={1}>
//                 <Grid container justifyContent={"space-between"}>
//                   {havePermissionToDelete && (
//                     <DeleteArticleButton
//                       variant="contained"
//                       size="large"
//                       onClick={handleDeleteArticle}
//                       disabled={loading || indexing}
//                       startIcon={<DeleteOutlineIcon />}
//                       sx={{ whiteSpace: "nowrap" }}
//                     >
//                       {loading && <CircularProgress size={20} sx={{ marginRight: 1 }} />}
//                       {indexing ? "Indexing..." : "Delete Article"}
//                     </DeleteArticleButton>
//                   )}
//                   {havePermissionToUpdate && (
//                     <Button variant="contained" size="large" type="submit" disabled={loading || indexing}>
//                       Update Article
//                     </Button>
//                   )}
//                 </Grid>
//               </Grid>
//             )} */
// }

// const goToPublication = () => {
//   saveDraftArticle(undefined)
//   saveArticle(undefined)
//   navigate(-1)
// }

// const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
//   // setValue("article", event.target.value)
// }

// const onSubmitHandler = (data: Article) => {
//   saveDraftArticle(data)
//   navigate(`./2`)
// }

// const handleDeleteArticle = async () => {
//   if (article && article.id && havePermissionToDelete) {
//     setLoading(true)
//     setCurrentArticleId(article.id)
//     await deleteArticle({
//       action: "article/delete",
//       id: article.id,
//     }).then((res) => {
//       if (res && res.error) {
//         setLoading(false)
//       } else {
//         setExecutePollInterval(true)
//       }
//     })
//   }
// }

// const [loading, setLoading] = useState<boolean>(false)
// const { deleteArticle } = usePoster()
// const [currentTab, setCurrentTab] = useState<"write" | "preview">("write")
// const permissions = article && article.publication && article.publication.permissions
// const havePermissionToDelete = haveActionPermission(permissions || [], "articleDelete", account || "")
// const havePermissionToUpdate = haveActionPermission(permissions || [], "articleUpdate", account || "")
// const isValidHash = article && isIPFS.multihash(article.article)

// const DeleteArticleButton = styled(Button)({
//   border: `2px solid ${palette.grays[400]}`,
//   background: palette.whites[400],
//   color: palette.grays[800],
//   "&:hover": {
//     background: palette.whites[1000],
//   },
// })

// import TurndownService from "turndown"
// const turndownService = new TurndownService()

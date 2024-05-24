/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Box, Button, Chip, CircularProgress, Grid, Stack, Typography } from "@mui/material"
import { styled } from "@mui/styles"
import { palette, typography } from "@/theme"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import { Article } from "@/models/publication"
import EditIcon from "@mui/icons-material/Edit"

import moment from "moment"
import { useArticleContext } from "@/services/publications/contexts"
import { useNavigate } from "react-router-dom"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import usePoster from "@/services/poster/hooks/usePoster"
import usePublication from "@/services/publications/hooks/usePublication"
import { usePosterContext } from "@/services/poster/context"
import useArticle from "@/services/publications/hooks/useArticle"
import isIPFS from "is-ipfs"
import { useIpfs } from "@/hooks/useIpfs"
import { shortTitle } from "@/utils/string-handler"
import { processArticleContent } from "@/utils/modifyHTML"

const ArticleItemContainer = styled(Box)({
  background: palette.grays[50],
  backdropFilter: "blur(2px)",
  borderRadius: 4,
  border: `1px solid ${palette.grays[200]}`,
  boxShadow: `0 8px 32px rgba(0,0,0,0.15)`,
  transition: "box-shadow 0.25s ease-in-out",
  cursor: "pointer",
  "&:hover": {
    boxShadow: `0 8px 40px rgba(0,0,0,0.2)`,
  },
})

const ArticleItemEditButton = styled(Button)({
  border: `2px solid ${palette.grays[400]}`,
  background: palette.whites[400],
  color: palette.grays[800],
  "&:hover": {
    background: palette.whites[1000],
  },
})

const ThumbnailImage = styled("img")({
  borderRadius: 4,
  height: "100%",
  objectFit: "cover",
})

type ArticleItemProps = {
  article: Article
  couldUpdate: boolean
  couldDelete: boolean
  publicationSlug: string
}
export const ArticleItem: React.FC<ArticleItemProps> = React.memo(
  ({ article, couldUpdate, couldDelete, publicationSlug }) => {
    const ipfs = useIpfs()
    const navigate = useNavigate()
    const { saveArticle, saveDraftArticle, setArticleEditorState, articleEditorState } = useArticleContext()
    const { setLastPathWithChainName } = usePosterContext()
    const { deleteArticle } = usePoster()
    const { description, image, title, tags, lastUpdated, id } = article
    const { indexing, transactionCompleted, setExecutePollInterval, setCurrentArticleId } =
      usePublication(publicationSlug)
    const { imageSrc } = useArticle(article.id || "")
    const articleTitle = shortTitle(title, 30)
    const articleDescription = description && shortTitle(description, 165)
    const date = lastUpdated && new Date(parseInt(lastUpdated) * 1000)
    const [loading, setLoading] = useState<boolean>(false)
    const [navigateEditArticle, setNavigateEditArticle] = useState<boolean>(false)
    const [articleHtmlContent, setArticleHtmlContent] = useState<string | undefined>(undefined)
    const isValidHash = useMemo(() => article && isIPFS.multihash(article.article), [article?.article])

    const decodeArticleContent = async () => {
      if (article.article) {
        if (isValidHash) {
          const data = await ipfs.getText(article.article)
          if (data) {
            return data
          }
        } else {
          //the article content without hash
          return article.article
        }
      }
    }

    const fetchArticleContent = useCallback(async () => {
      try {
        const data = await decodeArticleContent()
        if (data) {
          setArticleHtmlContent(data)
        }
      } catch (error: any) {
        if (error.message.includes("504")) {
          // Handle specific 504 error
          console.error("There was an issue fetching the hash content. Please try again later.")
        } else {
          // Handle other general errors
          console.error("An error occurred: ", error)
        }
      }
    }, [article])

    useEffect(() => {
      fetchArticleContent()
    }, [fetchArticleContent])

    useEffect(() => {
      if (transactionCompleted) {
        navigate(-1)
      }
    }, [navigate, transactionCompleted])

    useEffect(() => {
      if (navigateEditArticle && articleEditorState) {
        navigate(`./${id}/edit`)
        setNavigateEditArticle(false)
      }
    }, [navigate, navigateEditArticle])

    useEffect(() => {
      setLastPathWithChainName(window.location.hash)
    }, [setLastPathWithChainName])

    const handleDeleteArticle = async () => {
      if (article && article.id && couldDelete) {
        setLoading(true)
        await deleteArticle({
          action: "article/delete",
          id: article.id,
        }).then((res) => {
          setCurrentArticleId(article.id)
          if (res && res.error) {
            setLoading(false)
          } else {
            setExecutePollInterval(true)
          }
        })
      }
    }

    const handleEditArticle = async () => {
      if (article) {
        return await processArticleContent(article, ipfs, isValidHash).then(({ img, content, modifiedHTMLString }) => {
          saveDraftArticle({ ...article, title: article.title, image: img })
          setArticleEditorState(modifiedHTMLString ?? content ?? undefined)
          setNavigateEditArticle(true)
        })
      }
    }

    return (
      <ArticleItemContainer
        onClick={() => {
          if (articleHtmlContent) {
            navigate(`./${id}`)
            saveArticle(article)
          }
        }}
      >
        <Grid container spacing={2}>
          {image && (
            <Grid item xs={4} container justifyContent="center" alignItems="center">
              {imageSrc ? (
                <ThumbnailImage src={imageSrc} />
              ) : (
                <CircularProgress color="primary" size={30} sx={{ marginRight: 1, color: palette.primary[1000] }} />
              )}
            </Grid>
          )}
          <Grid item xs={image ? 8 : 12}>
            <Box sx={{ display: "flex", flexDirection: "column", height: "100%", p: 3 }}>
              {/* Article Info */}
              <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, mb: 2 }}>
                <Typography fontFamily={typography.fontFamilies.sans} variant="subtitle1" fontWeight={600}>
                  {articleTitle}
                </Typography>
                <Stack alignItems="flex-start" direction="row" spacing={2}>
                  {date && (
                    <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                      {moment(date).format("MMMM DD, YYYY")}
                    </Typography>
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      direction: "row",
                      flexWrap: "wrap",
                    }}
                  >
                    {tags &&
                      tags.length > 0 &&
                      tags.map((tag, index) => {
                        return (
                          <Box sx={{ display: "flex", p: "2px" }} key={index}>
                            <Chip label={tag} size="small" />
                          </Box>
                        )
                      })}
                  </Box>
                </Stack>
                {articleDescription && (
                  <Typography
                    variant="body1"
                    sx={{
                      color: palette.grays[900],
                      fontSize: 14,
                      lineHeight: 1.5,
                      mt: 2,
                    }}
                  >
                    {articleDescription}
                  </Typography>
                )}
              </Box>
              {/* Action Buttons */}
              <Box alignItems="center" display="flex" justifyContent="space-between">
                <Box>
                  <Grid container gap={2}>
                    {couldUpdate && (
                      <Box>
                        <ArticleItemEditButton
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleEditArticle()
                          }}
                          variant="contained"
                          size="small"
                          startIcon={<EditIcon sx={{ width: 16, height: 16 }} />}
                          disabled={loading || indexing || !articleHtmlContent}
                        >
                          Edit Article
                        </ArticleItemEditButton>
                      </Box>
                    )}
                    {couldDelete && (
                      <Box>
                        <ArticleItemEditButton
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleDeleteArticle()
                          }}
                          variant="contained"
                          size="small"
                          disabled={loading || indexing}
                          startIcon={<DeleteOutlineIcon sx={{ width: 16, height: 16 }} />}
                        >
                          {loading && <CircularProgress size={20} sx={{ marginRight: 1 }} />}
                          {indexing ? "Indexing..." : "Delete Article"}
                        </ArticleItemEditButton>
                      </Box>
                    )}
                  </Grid>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  endIcon={<ArrowForwardIosIcon sx={{ width: 16, height: 16 }} />}
                  disabled={loading || indexing || !articleHtmlContent}
                  onClick={() => {
                    navigate(`./${id}`)
                    saveArticle(article)
                  }}
                >
                  Read Article
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ArticleItemContainer>
    )
  },
)

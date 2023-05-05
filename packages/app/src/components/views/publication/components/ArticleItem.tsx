/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from "react"
import { Box, Button, Chip, CircularProgress, Grid, Stack, Typography } from "@mui/material"
import { styled } from "@mui/styles"
import { palette, typography } from "../../../../theme"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import { Article } from "../../../../models/publication"
import EditIcon from "@mui/icons-material/Edit"

import moment from "moment"
import { useArticleContext } from "../../../../services/publications/contexts"
import { useNavigate } from "react-router-dom"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import usePoster from "../../../../services/poster/hooks/usePoster"
import usePublication from "../../../../services/publications/hooks/usePublication"
import { usePosterContext } from "../../../../services/poster/context"
import useArticle from "../../../../services/publications/hooks/useArticle"
import isIPFS from "is-ipfs"
import { useIpfs } from "../../../../hooks/useIpfs"
import { checkTag, shortTitle } from "../../../../utils/string-handler"

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
    const { saveArticle, saveDraftArticle, setArticleContent } = useArticleContext()
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

    const [articleHtmlContent, setArticleHtmlContent] = useState<string | undefined>(undefined)

    const decodeArticleContent = async () => {
      if (article.article) {
        const isValidHash = isIPFS.multihash(article.article)
        if (isValidHash) {
          const data = await ipfs.getText(article.article)
          if (data) {
            return data
          }
        }
      }
    }

    const fetchArticleContent = useCallback(async () => {
      const data = await decodeArticleContent()
      if (data) {
        setArticleHtmlContent(data)
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
        const { image: thumbnailImg, article: articleContent } = article

        const imgPromise: Promise<string | null> = thumbnailImg ? ipfs.getImgSrc(thumbnailImg) : Promise.resolve(null)
        const contentPromise: Promise<void | null> = articleContent
          ? ipfs.getText(articleContent).then((content) => {
              if (content) {
                const block = checkTag(content)
                if (block.length) {
                  setArticleContent(block)
                }
              }
            })
          : Promise.resolve(null)

        Promise.all([imgPromise, contentPromise]).then(([img]) => {
          saveDraftArticle({ ...article, title: article.title, image: img })
        })

        navigate(`./${id}/edit`)
      }
    }

    return (
      <ArticleItemContainer
        onClick={() => {
          navigate(`./${id}`)
          saveArticle(article)
        }}
      >
        <Grid container spacing={2}>
          {image && (
            <Grid item xs={4}>
              <ThumbnailImage src={imageSrc} />
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
                  disabled={loading || indexing}
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

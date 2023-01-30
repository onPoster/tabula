import React, { useEffect, useState } from "react"
import { Box, Button, Chip, CircularProgress, Grid, Stack, Typography } from "@mui/material"
import { styled } from "@mui/styles"
import { palette, typography } from "../../../../theme"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import { Article } from "../../../../models/publication"
import EditIcon from "@mui/icons-material/Edit"
import { shortTitle } from "../../../../utils/string"
import moment from "moment"
import { usePublicationContext } from "../../../../services/publications/contexts"
import { useNavigate } from "react-router-dom"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import usePoster from "../../../../services/poster/hooks/usePoster"
import usePublication from "../../../../services/publications/hooks/usePublication"
import { usePosterContext } from "../../../../services/poster/context"
import useArticle from "../../../../services/publications/hooks/useArticle"

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
  height: "calc(100% - 2px)",
  objectFit: "cover",
})

type ArticleItemProps = {
  article: Article
  couldUpdate: boolean
  couldDelete: boolean
}
const ArticleItem: React.FC<ArticleItemProps> = ({ article, couldUpdate, couldDelete }) => {
  const navigate = useNavigate()
  const { saveArticle } = usePublicationContext()
  const { setLastPathWithChainName } = usePosterContext()
  const { deleteArticle } = usePoster()
  const { description, image, title, tags, lastUpdated, id, publication } = article
  const { indexing, transactionCompleted, setExecutePollInterval, setCurrentArticleId } = usePublication(
    publication?.id || "",
  )
  const { imageSrc } = useArticle(article.id || "")
  const articleTitle = shortTitle(title, 30)
  const articleDescription = description && shortTitle(description, 165)
  const date = lastUpdated && new Date(parseInt(lastUpdated) * 1000)
  const publicationId = article.publication?.id
  const [loading, setLoading] = useState<boolean>(false)

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

  return (
    <ArticleItemContainer
      onClick={() => {
        navigate(`../${publicationId}/${id}`)
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
                          navigate(`../${publicationId}/${id}/edit`)
                          saveArticle(article)
                        }}
                        variant="contained"
                        size="small"
                        startIcon={<EditIcon sx={{ width: 16, height: 16 }} />}
                        disabled={loading || indexing}
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
                  navigate(`../${publicationId}/${id}`)
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
}

export default ArticleItem

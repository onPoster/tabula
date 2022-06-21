import React, { useEffect, useState } from "react"
import { Box, Button, Chip, CircularProgress, Grid, Stack, Typography } from "@mui/material"
import { styled } from "@mui/styles"
import { palette, typography } from "../../theme"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import { Article } from "../../models/publication"
import EditIcon from "@mui/icons-material/Edit"
import { shortTitle } from "../../utils/string"
import moment from "moment"
import { usePublicationContext } from "../../services/publications/contexts"
import { useNavigate } from "react-router-dom"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import { usePosterContext } from "../../services/poster/context"
import usePoster from "../../services/poster/hooks/usePoster"
import usePublication from "../../services/publications/hooks/usePublication"
import { find } from "lodash"
import { useNotification } from "../../hooks/useNotification"

const PostItemContainer = styled(Box)({
  minHeight: "105px",
  background: palette.grays[100],
  borderRadius: 4,
  cursor: "pointer",
  padding: 20,
  "&:hover": {
    background: palette.grays[200],
    "& .arrow-forward": {
      color: palette.grays[600],
    },
  },
})

const PostItemEditButton = styled(Button)({
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

type PostItemProps = {
  article: Article
  couldUpdate: boolean
  couldDelete: boolean
}
const PostItem: React.FC<PostItemProps> = ({ article, couldUpdate, couldDelete }) => {
  const navigate = useNavigate()
  const openNotification = useNotification()
  const { saveArticle, savePublication } = usePublicationContext()
  const { setIsIndexing, isIndexing, transactionUrl } = usePosterContext()
  const { deleteArticle } = usePoster()
  const { description, image, title, tags, lastUpdated, id, publication } = article
  const { data: publicationRefetch, refetch } = usePublication(publication?.id || "")
  const articleTitle = shortTitle(title, 30)
  const articleDescription = description && shortTitle(description, 165)
  const date = lastUpdated && new Date(parseInt(lastUpdated) * 1000)
  const publicationId = article.publication?.id
  const [loading, setLoading] = useState<boolean>(false)

  //Execute poll interval to know the latest permission indexed
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        refetch()
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [refetch, loading])

  //Check is the transaction is already indexed
  useEffect(() => {
    if (loading && publicationRefetch?.articles && article) {
      const articleDeleted = find(publicationRefetch.articles, { id: article.id })
      if (!articleDeleted) {
        setLoading(false)
        setIsIndexing(false)
        savePublication(publicationRefetch)
        openNotification({
          message: "Execute transaction confirmed!",
          autoHideDuration: 5000,
          variant: "success",
          detailsLink: transactionUrl,
        })
        navigate(-1)
      }
    }
  }, [article, loading, navigate, openNotification, publicationRefetch, savePublication, setIsIndexing, transactionUrl])

  const handleDeleteArticle = async () => {
    if (article && article.id && couldDelete) {
      setLoading(true)
      await deleteArticle({
        action: "article/delete",
        id: article.id,
      }).then((res) => {
        if (res && res.error) {
          setLoading(false)
          setIsIndexing(false)
        }
      })
    }
  }

  return (
    <PostItemContainer>
      <Grid container spacing={2}>
        {image && (
          <Grid item xs={4}>
            <ThumbnailImage src={`https://ipfs.infura.io/ipfs/${image}`} />
          </Grid>
        )}
        <Grid item xs={8}>
          <Typography fontFamily={typography.fontFamilies.sans} variant="subtitle1" fontWeight={600}>
            {articleTitle}
          </Typography>
          <Stack alignItems="center" direction="row" spacing={2}>
            {date && <Typography variant="body2">{moment(date).format("MMMM DD, YYYY")}</Typography>}
            <Stack alignItems="center" direction="row" spacing={1}>
              {tags && tags.length > 0 && tags.map((tag, index) => <Chip label={tag} size="small" key={index} />)}
            </Stack>
          </Stack>
          <Typography
            variant="body1"
            sx={{
              color: palette.grays[900],
              fontSize: 14,
              lineHeight: 1.5,
              mt: 1,
            }}
          >
            {articleDescription}
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ height: 2, width: "100%", my: 1, bgcolor: palette.grays[200] }} />

      <Box alignItems="center" display="flex" justifyContent="space-between">
        <Box>
          <Grid container gap={2}>
            {couldUpdate && (
              <Box>
                <PostItemEditButton
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/publication/post-action/edit`)
                    saveArticle(article)
                  }}
                  variant="contained"
                  size="small"
                  startIcon={<EditIcon sx={{ width: 16, height: 16 }} />}
                >
                  Edit Post
                </PostItemEditButton>
              </Box>
            )}
            {couldDelete && (
              <Box>
                <PostItemEditButton
                  onClick={handleDeleteArticle}
                  variant="contained"
                  size="small"
                  disabled={loading || isIndexing}
                  startIcon={<DeleteOutlineIcon sx={{ width: 16, height: 16 }} />}
                >
                  {loading && <CircularProgress size={20} sx={{ marginRight: 1 }} />}
                  {isIndexing ? "Indexing..." : "Delete Post"}
                </PostItemEditButton>
              </Box>
            )}
          </Grid>
        </Box>

        <Button
          variant="contained"
          color="primary"
          size="small"
          endIcon={<ArrowForwardIosIcon sx={{ width: 16, height: 16 }} />}
          onClick={() => {
            navigate(`/publication/${publicationId}/article/${id}`)
            saveArticle(article)
          }}
        >
          Read Post
        </Button>
      </Box>
    </PostItemContainer>
  )
}

export default PostItem

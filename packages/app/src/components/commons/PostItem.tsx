import React from "react"
import { Box, Chip, Grid, Stack, Typography } from "@mui/material"
import { styled } from "@mui/styles"
import { palette, typography } from "../../theme"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import { Article } from "../../models/publication"
import EditIcon from "@mui/icons-material/Edit"
import { shortTitle } from "../../utils/string"
import moment from "moment"
import { usePublicationContext } from "../../services/publications/contexts"
import { useNavigate } from "react-router-dom"

const PostItemContainer = styled(Box)({
  alignItems: "center",
  minHeight: "105px",
  background: palette.grays[100],
  borderRadius: 4,
  cursor: "pointer",
  display: "flex",
  padding: "10px 20px",
  "&:hover": {
    background: palette.grays[200],
    "& .arrow-forward": {
      color: palette.grays[600],
    },
  },
})

const PostItemEditContainer = styled(Grid)({
  alignItems: "center",
  border: `2px solid ${palette.primary[400]}`,
  background: palette.whites[400],
  borderRadius: 4,
  color: palette.primary[800],
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  padding: 4,
  "&:hover": {
    background: palette.whites[1000],
  },
})

type PostItemProps = {
  article: Article
  couldUpdate: boolean
}
const PostItem: React.FC<PostItemProps> = ({ article, couldUpdate }) => {
  const navigate = useNavigate()
  const { saveArticle } = usePublicationContext()
  const { title, tags, lastUpdated, id } = article
  const articleTitle = shortTitle(title, 30)
  const date = lastUpdated && new Date(parseInt(lastUpdated) * 1000)
  const publicationId = article.publication && article.publication.id
  return (
    <PostItemContainer
      onClick={() => {
        navigate(`/publication/${publicationId}/article/${id}`)
        saveArticle(article)
      }}
    >
      <Grid container flexDirection={"column"} gap={1}>
        <Grid item>
          <Typography fontFamily={typography.fontFamilies.sans} variant="subtitle1" fontWeight={600}>
            {articleTitle}
          </Typography>
        </Grid>

        <Grid item>
          <Grid container gap={1}>
            {date && <Typography>{moment(date).format("MMMM DD, YYYY")}</Typography>}
            {tags && tags.length > 0 && tags.map((tag, index) => <Chip label={tag} size="small" key={index} />)}
          </Grid>
        </Grid>
      </Grid>
      <Stack alignItems="center" direction="row" spacing={2}>
        {couldUpdate && (
          <PostItemEditContainer
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/publication/post-action/edit`)
              saveArticle(article)
            }}
          >
            <EditIcon sx={{ width: 20, height: 20 }} />
          </PostItemEditContainer>
        )}
        <ArrowForwardIosIcon className="arrow-forward" />
      </Stack>
    </PostItemContainer>
  )
}

export default PostItem

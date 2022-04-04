import React from "react"
import { Chip, Grid, Typography } from "@mui/material"
import { styled } from "@mui/styles"
import { palette, typography } from "../../theme"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import { Post } from "../../models/publication"
import EditIcon from "@mui/icons-material/Edit"
const PostItemContainer = styled(Grid)({
  minHeight: 105,
  background: palette.grays[100],
  borderRadius: 4,
  padding: "10px 20px",
  cursor: "pointer",
})
const PostItemIconGrid = styled(Grid)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#91908e",
})

const PostItemEditContainer = styled(Grid)({
  border: `2px solid ${palette.grays[600]}`,
  background: palette.whites[600],
  borderRadius: 4,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: 32,
  height: 32,
  cursor: "pointer",
})

type PostItemProps = {
  post: Post
  onClick: () => void
}
const PostItem: React.FC<PostItemProps> = ({ post, onClick }) => {
  const { title, tags } = post
  return (
    <PostItemContainer container alignItems={"center"} onClick={onClick}>
      <Grid item xs={10}>
        <Grid container flexDirection={"column"} gap={1}>
          <Grid item>
            <Typography fontFamily={typography.fontFamilies.sans} variant="subtitle1" fontWeight={600}>
              {title}
            </Typography>
          </Grid>
          {tags && tags.length && (
            <Grid item>
              <Grid container gap={1}>
                <Typography>July 21, 2021</Typography>
                {tags.map((tag, index) => (
                  <Chip label={tag} size="small" key={index} />
                ))}
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
      <PostItemIconGrid item xs={2}>
        <Grid container alignItems={"center"} justifyContent={"space-between"}>
          <PostItemEditContainer>
            <EditIcon style={{ color: palette.grays[1000] }} />
          </PostItemEditContainer>
          <ArrowForwardIosIcon />
        </Grid>
      </PostItemIconGrid>
    </PostItemContainer>
  )
}

export default PostItem

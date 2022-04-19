import React from "react"
import { Button, Grid, Typography } from "@mui/material"
import { palette, typography } from "../../../../theme"
import AddIcon from "@mui/icons-material/Add"
import PostItem from "../../../commons/PostItem"
import { useNavigate } from "react-router-dom"
import { usePublicationContext } from "../../../../services/publications/contexts"

const PostSection: React.FC = () => {
  const navigate = useNavigate()
  const { publication } = usePublicationContext()
  const articles = publication && publication.articles
  return (
    <>
      <Grid container justifyContent="space-between" alignItems={"center"} my={4}>
        <Grid item>
          <Typography
            color={palette.grays[1000]}
            variant="h5"
            fontFamily={typography.fontFamilies.sans}
            sx={{ margin: 0 }}
          >
            Posts
          </Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" size="medium" onClick={() => navigate("/publication/post-action/new")}>
            <AddIcon style={{ marginRight: 13 }} />
            New Post
          </Button>
        </Grid>
      </Grid>
      <Grid container flexDirection="column" alignItems="flex-start" justifyContent={"flex-start"} gap={4}>
        {articles &&
          articles.length > 0 &&
          articles.map((article) => (
            <Grid item sx={{ width: "100%" }} key={article.id || ""}>
              <PostItem article={article} />
            </Grid>
          ))}
      </Grid>
    </>
  )
}

export default PostSection

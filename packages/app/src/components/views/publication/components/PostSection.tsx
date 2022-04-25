import React from "react"
import { Button, Grid, Typography } from "@mui/material"
import { palette, typography } from "../../../../theme"
import AddIcon from "@mui/icons-material/Add"
import PostItem from "../../../commons/PostItem"
import { useNavigate } from "react-router-dom"
import { usePublicationContext } from "../../../../services/publications/contexts"
import { haveActionPermission } from "../../../../utils/permission"
import { useWeb3React } from "@web3-react/core"

const PostSection: React.FC = () => {
  const navigate = useNavigate()
  const { account } = useWeb3React()
  const { publication } = usePublicationContext()
  const articles = publication && publication.articles
  const permissions = publication && publication.permissions
  const havePermissionToCreate = permissions ? haveActionPermission(permissions, "articleCreate", account || "") : false
  const havePermissionToUpdate = permissions ? haveActionPermission(permissions, "articleUpdate", account || "") : false
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
        {havePermissionToCreate && (
          <Grid item>
            <Button variant="contained" size="medium" onClick={() => navigate("/publication/post-action/new")}>
              <AddIcon style={{ marginRight: 13 }} />
              New Post
            </Button>
          </Grid>
        )}
      </Grid>
      <Grid container flexDirection="column" alignItems="flex-start" justifyContent={"flex-start"} gap={4}>
        {articles &&
          articles.length > 0 &&
          articles.map((article) => (
            <Grid item sx={{ width: "100%" }} key={article.id || ""}>
              <PostItem article={article} couldUpdate={havePermissionToUpdate}/>
            </Grid>
          ))}
      </Grid>
    </>
  )
}

export default PostSection

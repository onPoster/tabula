import React from "react"
import { Button, Grid, Typography } from "@mui/material"
import { palette, typography } from "../../../../theme"
import AddIcon from "@mui/icons-material/Add"
import PostItem from "../../../commons/PostItem"
import { useNavigate } from "react-router-dom"

const PostSection: React.FC = () => {
  const navigate = useNavigate()
  return (
    <Grid container flexDirection="column" gap={4} mt={4}>
      <Grid item>
        <Grid container justifyContent="space-between" alignItems={"center"}>
          <Typography
            color={palette.grays[1000]}
            variant="h5"
            fontFamily={typography.fontFamilies.sans}
            sx={{ margin: 0 }}
          >
            Posts
          </Typography>
          <Button variant="contained" size="medium" onClick={() => navigate("/publication/create-post")}>
            <AddIcon style={{ marginRight: 13 }} />
            New Post
          </Button>
        </Grid>
      </Grid>
      <Grid item>
        <PostItem post={{ title: "Gossip of the Old World", tags: ["test"], id: "1" }} onClick={() => console.log()} />
      </Grid>
    </Grid>
  )
}

export default PostSection

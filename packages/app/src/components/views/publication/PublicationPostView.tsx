import { Avatar, Grid, styled, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { usePublicationContext } from "../../../services/publications/contexts"
import { palette, typography } from "../../../theme"
import { ViewContainer } from "../../commons/ViewContainer"
import PublicationPage from "../../layout/PublicationPage"
import PostSection from "./components/PostSection"
import PublicationTabs from "./components/PublicationTabs"

const PublicationPostContainer = styled(Grid)(({ theme }) => ({
  [`${theme.breakpoints.down("md")}`]: {
    justifyContent: "center",
    marginTop: 20,
  },

  [`${theme.breakpoints.up("lg")}`]: {
    justifyContent: "flex-start",
    alignItems: "center",
  },
}))

export const PublicationPostView: React.FC = () => {
  const { postId } = useParams<{ postId: string }>()
  const { publication, fetchPublication } = usePublicationContext()
  const [currentTab, setCurrentTab] = useState<string>("posts")

  useEffect(() => {
    if (postId) {
      fetchPublication(postId)
    }
  }, [postId, fetchPublication])

  return (
    <PublicationPage publication={publication} showCreatePost={true}>
      {publication && (
        <ViewContainer maxWidth="sm">
          <Grid container gap={11} flexDirection={"column"} mt={11}>
            <Grid item>
              <PublicationPostContainer container gap={3} alignItems={"center"}>
                <Grid item>
                  <Avatar
                    sx={{ width: 160, height: 160 }}
                    src={publication.image ? `https://ipfs.infura.io/ipfs/${publication.image}` : ""}
                  >
                    {" "}
                  </Avatar>
                </Grid>
                <Grid item>
                  <Grid container gap={2} flexDirection={"column"}>
                    <Typography
                      color={palette.grays[1000]}
                      variant="h5"
                      fontFamily={typography.fontFamilies.sans}
                      sx={{ margin: 0 }}
                    >
                      {publication.title}
                    </Typography>
                    {publication.description && (
                      <Typography color={palette.grays[1000]} sx={{ margin: 0 }}>
                        {publication.description}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </PublicationPostContainer>
            </Grid>
            <Grid item>
              <PublicationTabs onChange={setCurrentTab} />
              {currentTab === "posts" && <PostSection />}
            </Grid>
          </Grid>
        </ViewContainer>
      )}
    </PublicationPage>
  )
}

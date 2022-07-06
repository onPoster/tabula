import { Avatar, CircularProgress, Grid, styled, Typography } from "@mui/material"
import { useWeb3React } from "@web3-react/core"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { publicationIdToChainId } from "../../../models/publication"
import { usePublicationContext } from "../../../services/publications/contexts"
import usePublication from "../../../services/publications/hooks/usePublication"
import { palette, typography } from "../../../theme"
import { haveActionPermission, isOwner } from "../../../utils/permission"
import PublicationAvatar from "../../commons/PublicationAvatar"
import { ViewContainer } from "../../commons/ViewContainer"
import PublicationPage from "../../layout/PublicationPage"
import { PermissionSection } from "./components/PermissionSection"
import PostSection from "./components/PostSection"
import PublicationTabs from "./components/PublicationTabs"
import { SettingSection } from "./components/SettingSection"

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

interface PublicationPostViewProps {
  updateChainId: (chainId: number) => void
}

export const PublicationPostView: React.FC<PublicationPostViewProps> = ({ updateChainId }) => {
  const { publicationId } = useParams<{ publicationId: string }>()
  const { account } = useWeb3React()
  const { savePublication, editingPublication, saveDraftPublicationImage } = usePublicationContext()
  const { data: publication, loading, executeQuery } = usePublication(publicationId || "")
  const [currentTab, setCurrentTab] = useState<"posts" | "permissions" | "settings">("posts")
  const permissions = publication && publication.permissions
  const havePermission = permissions ? isOwner(permissions, account || "") : false
  const havePermissionToUpdate = permissions
    ? haveActionPermission(permissions, "publicationUpdate", account || "")
    : false
  const havePermissionToDelete = permissions
    ? haveActionPermission(permissions, "publicationDelete", account || "")
    : false

  useEffect(() => {
    if (publicationId != null) {
      updateChainId(publicationIdToChainId(publicationId))
    }
  }, [publicationId, updateChainId])

  useEffect(() => {
    if (publicationId) {
      executeQuery()
    }
  }, [publicationId, executeQuery])

  useEffect(() => {
    if (publication) {
      savePublication(publication)
    }
  }, [publication, savePublication])

  return (
    <PublicationPage publication={publication} showCreatePost={true}>
      {loading && (
        <Grid container justifyContent="center" alignItems="center" my={2}>
          <CircularProgress color="primary" size={50} sx={{ marginRight: 1, color: palette.primary[1000] }} />
        </Grid>
      )}
      {publication && (
        <ViewContainer maxWidth="sm">
          <Grid container gap={11} flexDirection={"column"} mt={11}>
            <Grid item>
              <PublicationPostContainer container gap={3} alignItems={"center"}>
                <Grid item>
                  {!editingPublication && (
                    <Avatar
                      sx={{ width: 160, height: 160 }}
                      src={publication.image ? `https://ipfs.infura.io/ipfs/${publication.image}` : ""}
                    >
                      {" "}
                    </Avatar>
                  )}
                  {editingPublication && (
                    <PublicationAvatar defaultImage={publication.image} onFileSelected={saveDraftPublicationImage} />
                  )}
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
            {havePermission && (
              <Grid item>
                <PublicationTabs
                  onChange={setCurrentTab}
                  couldEdit={havePermissionToUpdate}
                  couldDelete={havePermissionToDelete}
                />
                {currentTab === "posts" && <PostSection />}
                {currentTab === "permissions" && <PermissionSection />}
                {currentTab === "settings" && (
                  <SettingSection couldEdit={havePermissionToUpdate} couldDelete={havePermissionToDelete} />
                )}
              </Grid>
            )}
            {!havePermission && (
              <Grid item>
                <PostSection />
              </Grid>
            )}
          </Grid>
        </ViewContainer>
      )}
    </PublicationPage>
  )
}

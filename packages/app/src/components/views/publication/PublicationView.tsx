import { Avatar, Box, CircularProgress, Grid, Stack, Typography } from "@mui/material"
import { useWeb3React } from "@web3-react/core"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { usePublicationContext } from "../../../services/publications/contexts"
import usePublication from "../../../services/publications/hooks/usePublication"
import { palette, typography } from "../../../theme"
import { haveActionPermission, isOwner } from "../../../utils/permission"
import PublicationAvatar from "../../commons/PublicationAvatar"
import { ViewContainer } from "../../commons/ViewContainer"
import PublicationPage from "../../layout/PublicationPage"
import { PermissionSection } from "./components/PermissionSection"
import ArticleSection from "./components/ArticleSection"
import PublicationTabs from "./components/PublicationTabs"
import { SettingSection } from "./components/SettingSection"

interface PublicationViewProps {
  updateChainId: (chainId: number) => void
}

export const PublicationView: React.FC<PublicationViewProps> = ({ updateChainId }) => {
  console.log("PublicationView")
  const { publicationSlug } = useParams<{ publicationSlug: string }>()
  const { account } = useWeb3React()
  const { savePublication, editingPublication, saveDraftPublicationImage } = usePublicationContext()
  const {
    data: publication,
    loading,
    executeQuery,
    imageSrc,
    publicationId,
    chainId,
  } = usePublication(publicationSlug || "")
  const [currentTab, setCurrentTab] = useState<"articles" | "permissions" | "settings">("articles")
  const permissions = publication && publication.permissions
  const havePermission = permissions ? isOwner(permissions, account || "") : false
  const havePermissionToUpdate = permissions
    ? haveActionPermission(permissions, "publicationUpdate", account || "")
    : false
  const havePermissionToDelete = permissions
    ? haveActionPermission(permissions, "publicationDelete", account || "")
    : false

  useEffect(() => {
    if (chainId != null) {
      updateChainId(chainId)
    }
  }, [chainId, updateChainId])

  useEffect(() => {
    if (publicationId != null) {
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
        <ViewContainer maxWidth="md">
          <Grid container gap={11} flexDirection={"column"} mt={11}>
            <Grid item>
              <Stack
                gap={3}
                direction={["column", "row"]}
                sx={{
                  alignItems: ["flex-start", "flex-start", "center"],
                  justifyContent: ["center", "center", "flex-start"],
                }}
              >
                <Box width={160}>
                  {!editingPublication && (
                    <Avatar sx={{ width: 160, height: 160 }} src={imageSrc}>
                      {" "}
                    </Avatar>
                  )}
                  {editingPublication && (
                    <PublicationAvatar defaultImage={publication.image} onFileSelected={saveDraftPublicationImage} />
                  )}
                </Box>
                <Stack spacing={2}>
                  <Stack spacing={1}>
                    <Typography
                      color={palette.grays[1000]}
                      variant="h5"
                      fontFamily={typography.fontFamilies.sans}
                      lineHeight={1}
                      sx={{ margin: 0 }}
                    >
                      {publication.title}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        alignItems: "center",
                        cursor: "pointer",
                        "&:hover .copyIcon": { color: palette.grays[1000] },
                      }}
                    >
                      <Typography
                        color={palette.grays[600]}
                        fontFamily={typography.fontFamilies.monospace}
                        fontSize={10}
                        sx={{ wordBreak: "break-all" }}
                      >
                        {publication.id}
                      </Typography>
                    </Stack>
                  </Stack>
                  {publication.description && (
                    <Typography color={palette.grays[1000]} sx={{ margin: 0 }}>
                      {publication.description}
                    </Typography>
                  )}
                </Stack>
              </Stack>
            </Grid>
            {havePermission && (
              <Grid item>
                <PublicationTabs
                  onChange={setCurrentTab}
                  couldEdit={havePermissionToUpdate}
                  couldDelete={havePermissionToDelete}
                />
                {currentTab === "articles" && <ArticleSection />}
                {currentTab === "permissions" && <PermissionSection />}
                {currentTab === "settings" && (
                  <SettingSection couldEdit={havePermissionToUpdate} couldDelete={havePermissionToDelete} />
                )}
              </Grid>
            )}
            {!havePermission && (
              <Grid item>
                <PublicationTabs onChange={setCurrentTab} couldEdit={false} couldDelete={false} />
                {currentTab === "articles" && <ArticleSection />}
                {currentTab === "permissions" && <PermissionSection />}
              </Grid>
            )}
          </Grid>
        </ViewContainer>
      )}
    </PublicationPage>
  )
}

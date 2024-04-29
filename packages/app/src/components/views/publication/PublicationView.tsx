import { Box, CircularProgress, Grid, Stack, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { usePublicationContext } from "@/services/publications/contexts"
import usePublication from "@/services/publications/hooks/usePublication"
import { palette, typography } from "@/theme"
import { haveActionPermission, isOwner } from "@/utils/permission"
import PublicationAvatar from "@/components/commons/PublicationAvatar"
import { ViewContainer } from "@/components/commons/ViewContainer"
import PublicationPage from "@/components/layout/PublicationPage"
import { PermissionSection } from "@/components/views/publication/components/PermissionSection"
import { ArticlesSection } from "@/components/views/publication/components/ArticlesSection"
import PublicationTabs from "@/components/views/publication/components/PublicationTabs"
import { SettingSection } from "@/components/views/publication/components/SettingSection"
import Avatar from "@/components/commons/Avatar"
import { useWeb3ModalAccount } from "@web3modal/ethers5/react"

interface PublicationViewProps {}

export const PublicationView: React.FC<PublicationViewProps> = () => {
  const { publicationSlug } = useParams<{ publicationSlug: string }>()
  const { address } = useWeb3ModalAccount()
  const { savePublication, editingPublication, saveDraftPublicationImage } = usePublicationContext()
  const { data: publication, loading, executeQuery, imageSrc, publicationId } = usePublication(publicationSlug || "")
  const [currentTab, setCurrentTab] = useState<"articles" | "permissions" | "settings">("articles")

  const permissions = publication && publication.permissions
  const havePermission = permissions ? isOwner(permissions, address || "") : false
  const havePermissionToUpdate = permissions
    ? haveActionPermission(permissions, "publicationUpdate", address || "")
    : false
  const havePermissionToDelete = permissions
    ? haveActionPermission(permissions, "publicationDelete", address || "")
    : false

  useEffect(() => {
    if (publicationId != null) {
      executeQuery()
    }
  }, [publicationId, executeQuery, publicationSlug])

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
                    <Avatar
                      storeImage
                      dynamicFavIcon
                      publicationSlug={publicationSlug || ""}
                      width={160}
                      height={160}
                    />
                  )}
                  {editingPublication && (
                    <PublicationAvatar defaultImage={imageSrc} onFileSelected={saveDraftPublicationImage} />
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
                    <Typography
                      color={palette.grays[600]}
                      fontFamily={typography.fontFamilies.monospace}
                      fontSize={10}
                      sx={{ wordBreak: "break-all" }}
                    >
                      {publicationSlug}
                    </Typography>
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
                {currentTab === "articles" && <ArticlesSection />}
                {currentTab === "permissions" && <PermissionSection />}
                {currentTab === "settings" && (
                  <SettingSection couldEdit={havePermissionToUpdate} couldDelete={havePermissionToDelete} />
                )}
              </Grid>
            )}
            {!havePermission && (
              <Grid item>
                <PublicationTabs onChange={setCurrentTab} couldEdit={false} couldDelete={false} />
                {currentTab === "articles" && <ArticlesSection />}
                {currentTab === "permissions" && <PermissionSection />}
              </Grid>
            )}
          </Grid>
        </ViewContainer>
      )}
    </PublicationPage>
  )
}

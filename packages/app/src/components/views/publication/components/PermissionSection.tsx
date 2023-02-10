import React from "react"
import { Box, Grid, Container, Typography, Stack } from "@mui/material"
import { palette } from "../../../../theme"
import AddIcon from "@mui/icons-material/Add"
import { usePublicationContext } from "../../../../services/publications/contexts"
import PermissionItem from "../../../commons/PermissionItem"
import { useNavigate } from "react-router-dom"
import { haveActionPermission, usersWithPermissions } from "../../../../utils/permission"

import { useWeb3React } from "@web3-react/core"

export const PermissionSection: React.FC = () => {
  const navigate = useNavigate()
  const { account } = useWeb3React()
  const { publication, savePermission } = usePublicationContext()
  const permissions = publication?.permissions || []
  const usersPermissions = usersWithPermissions(permissions)
  const havePermissionToEdit = haveActionPermission(permissions, "publicationPermissions", account || "")
  return (
    <Container maxWidth="sm">
      {/* <Grid container justifyContent="space-between" alignItems={"center"} my={4}>
        <Grid item>
          <Typography
            color={palette.grays[1000]}
            variant="h5"
            fontFamily={typography.fontFamilies.sans}
            sx={{ margin: 0 }}
          >
            Permissions
          </Typography>
        </Grid>
        {havePermissionToEdit && (
          <Grid item>
            <Button variant="contained" size="medium" onClick={() => navigate(`../${publication?.id}/permissions/new`)}>
              <AddIcon style={{ marginRight: 13 }} />
              New Permission
            </Button>
          </Grid>
        )}
      </Grid> */}
      <Grid container flexDirection="column" alignItems="flex-start" justifyContent={"flex-start"} gap={4} mt={6}>
        {usersPermissions.length > 0 &&
          usersPermissions.map((permission) => (
            <Grid item sx={{ width: "100%" }} key={permission.id || ""}>
              <PermissionItem
                publication={publication}
                permission={permission}
                canEdit={havePermissionToEdit}
                showRemove={usersPermissions.length > 1}
                onClick={() => {
                  savePermission(permission)
                  navigate(`./permissions/edit`)
                }}
              />
            </Grid>
          ))}
        {havePermissionToEdit && (
          <Stack
            onClick={() => navigate(`./permissions/new`)}
            direction="row"
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              cursor: "pointer",
              "&:hover .addIcon": {
                bgcolor: palette.grays[1000],
              },
              "&:hover .add-new-permissions": {
                color: palette.grays[600],
              },
            }}
          >
            <Typography className="add-new-permissions" color={palette.grays[400]}>
              Add new permission
            </Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Box
                className="addIcon"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 999,
                  bgcolor: palette.grays[800],
                  width: 16,
                  height: 16,
                }}
              >
                <AddIcon
                  sx={{
                    color: palette.whites[1000],
                    stroke: palette.whites[1000],
                    width: 10,
                    height: 10,
                    strokeWidth: 1,
                  }}
                />
              </Box>
              <Typography fontSize={12}>add</Typography>
            </Stack>
          </Stack>
        )}
      </Grid>
    </Container>
  )
}

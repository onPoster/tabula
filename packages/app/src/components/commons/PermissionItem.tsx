import React from "react"
import { Box, Button, Grid, Stack } from "@mui/material"
import { styled } from "@mui/styles"
import { palette } from "../../theme"
import { Permission } from "../../models/publication"
import EditIcon from "@mui/icons-material/Edit"
import CloseIcon from "@mui/icons-material/Close"
import { UserBadge } from "./UserBadge"

const PermissionItemContainer = styled(Box)({
  alignItems: "center",
  justifyContent: "space-between",
  display: "flex",
})

const PermissionItemEditContainer = styled(Grid)({
  alignItems: "center",
  border: `2px solid ${palette.grays[400]}`,
  background: palette.whites[400],
  borderRadius: 4,
  color: palette.grays[800],
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  padding: 4,
  "&:hover": {
    background: palette.whites[1000],
  },
})

type PermissionItemProps = {
  permission: Permission
  canEdit: boolean
  showRemove: boolean
  onClick: (id: string) => void
}
const PermissionItem: React.FC<PermissionItemProps> = ({ permission, canEdit, showRemove, onClick }) => {
  const { address, id } = permission

  return (
    <PermissionItemContainer>
      <UserBadge address={address} />
      <Stack spacing={2} direction="row" alignItems="center">
        {canEdit && (
          <PermissionItemEditContainer
            onClick={() => {
              canEdit && onClick(id ? id : "")
            }}
          >
            <EditIcon sx={{ width: 20, height: 20 }} />
          </PermissionItemEditContainer>
        )}
        {showRemove && (
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 999,
              bgcolor: palette.grays[800],
              cursor: "pointer",
              width: 16,
              height: 16,
              "&:hover": {
                bgcolor: palette.grays[1000],
              },
            }}
          >
            <CloseIcon
              sx={{ color: palette.whites[1000], stroke: palette.whites[1000], width: 10, height: 10, strokeWidth: 1 }}
            />
          </Box>
        )}
      </Stack>
    </PermissionItemContainer>
  )
}

export default PermissionItem

import React from "react"
import { Box, Grid } from "@mui/material"
import { styled } from "@mui/styles"
import { palette } from "../../theme"
import { Permission } from "../../models/publication"
import EditIcon from "@mui/icons-material/Edit"
import { WalletBadge } from "./WalletBadge"

const PermissionItemContainer = styled(Box)({
  alignItems: "center",
  minHeight: "48px",
  background: palette.grays[100],
  borderRadius: 4,
  cursor: "pointer",
  justifyContent: "space-between",
  display: "flex",
  padding: "10px 20px",
  "&:hover": {
    background: palette.grays[200],
  },
})

const PermissionItemEditContainer = styled(Grid)({
  alignItems: "center",
  border: `2px solid ${palette.primary[400]}`,
  background: palette.whites[400],
  borderRadius: 4,
  color: palette.primary[800],
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
  onClick: (id: string) => void
}
const PermissionItem: React.FC<PermissionItemProps> = ({ permission, canEdit, onClick }) => {
  const { address, id } = permission

  return (
    <PermissionItemContainer
      onClick={() => {
        canEdit && onClick(id ? id : "")
      }}
    >
      <WalletBadge address={address} />
      {canEdit && (
        <PermissionItemEditContainer>
          <EditIcon sx={{ width: 20, height: 20 }} />
        </PermissionItemEditContainer>
      )}
    </PermissionItemContainer>
  )
}

export default PermissionItem

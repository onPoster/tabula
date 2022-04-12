import React from "react"
import { Grid } from "@mui/material"
import { styled } from "@mui/styles"
import { palette } from "../../theme"
import { Permission } from "../../models/publication"
import EditIcon from "@mui/icons-material/Edit"
import { WalletBadge } from "./WalletBadge"

const PermissionItemContainer = styled(Grid)({
  minHeight: "48px",
  background: palette.grays[100],
  borderRadius: 4,
  padding: "10px 20px",
  cursor: "pointer",
  "&:hover": {
    background: palette.grays[200],
  },
})
const PermissionItemIconGrid = styled(Grid)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#91908e",
})

const PermissionItemEditContainer = styled(Grid)({
  border: `2px solid ${palette.grays[600]}`,
  background: palette.whites[600],
  borderRadius: 4,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: 32,
  height: 32,
  cursor: "pointer",
})

type PermissionItemProps = {
  permission: Permission
  onClick: (id: string) => void
}
const PermissionItem: React.FC<PermissionItemProps> = ({ permission, onClick }) => {
  const { address, id } = permission

  return (
    <PermissionItemContainer container alignItems={"center"} onClick={() => onClick(id ? id : "")}>
      <Grid item xs={10}>
        <WalletBadge address={address} />
      </Grid>
      <PermissionItemIconGrid item xs={2}>
        <PermissionItemEditContainer>
          <EditIcon style={{ color: palette.grays[1000] }} />
        </PermissionItemEditContainer>
      </PermissionItemIconGrid>
    </PermissionItemContainer>
  )
}

export default PermissionItem

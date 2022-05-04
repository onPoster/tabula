import { Avatar, Grid, Paper, styled, Typography } from "@mui/material"
import React from "react"
import { palette } from "../../theme"
import PushPinIcon from "@mui/icons-material/PushPin"
import LinkOffIcon from "@mui/icons-material/LinkOff"
import { useWeb3React } from "@web3-react/core"
import { useLocation, useNavigate } from "react-router-dom"
import { usePublicationContext } from "../../services/publications/contexts"

const UserOptionsContainer = styled(Paper)({
  padding: 8,
  border: "none",
  borderRadius: "4px !important",
  minWidth: 250,
})

const MenuItem = styled(Grid)({
  borderRadius: 4,
  padding: 8,
  "&:hover": {
    backgroundColor: palette.grays[50],
  }
})

export const UserOptions: React.FC = () => {
  const { deactivate } = useWeb3React()
  const { setCurrentPath } = usePublicationContext()
  const location = useLocation()
  const navigate = useNavigate()
  return (
    <UserOptionsContainer>
      <MenuItem
        item
        sx={{ cursor: "pointer" }}
        onClick={() => {
          setCurrentPath(location.pathname)
          navigate("/pinning")
        }}
      >
        <Grid container gap={1} alignItems="center">
          <Avatar sx={{ width: 28, height: 28, background: palette.grays[100] }}>
            <PushPinIcon sx={{ color: palette.grays[800], width: 18 }} />
          </Avatar>
          <Typography variant="body1">Update Pinning Service</Typography>
        </Grid>
      </MenuItem>
      <MenuItem item sx={{ cursor: "pointer" }} onClick={() => deactivate()}>
        <Grid container gap={1} alignItems="center">
          <Avatar sx={{ width: 28, height: 28, background: palette.grays[100] }}>
            <LinkOffIcon sx={{ color: palette.primary[800], width: 18 }} />
          </Avatar>
          <Typography variant="body1" color={palette.primary[1000]}>
            Disconnect Wallet
          </Typography>
        </Grid>
      </MenuItem>
    </UserOptionsContainer>
  )
}

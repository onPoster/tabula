import { Avatar, Grid, Paper, styled, Typography } from "@mui/material"
import React, { useState } from "react"
import { palette } from "../../theme"
import PushPinIcon from "@mui/icons-material/PushPin"
import LinkOffIcon from "@mui/icons-material/LinkOff"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"

import ShortcutIcon from "@mui/icons-material/Shortcut"
import { useWeb3React } from "@web3-react/core"
import { useLocation, useNavigate } from "react-router-dom"
import { usePublicationContext } from "../../services/publications/contexts"
import useLocalStorage from "../../hooks/useLocalStorage"
import IPFSNodeModal from "./IPFSNodeModal"

const UserOptionsContainer = styled(Paper)({
  padding: 8,
  border: "none",
  borderRadius: "4px !important",
  minWidth: 250,
  zIndex: 2,
})

const MenuItem = styled(Grid)({
  borderRadius: 4,
  padding: 8,
  "&:hover": {
    backgroundColor: palette.grays[50],
  },
})

export const UserOptions: React.FC = () => {
  const { deactivate } = useWeb3React()
  const { setCurrentPath } = usePublicationContext()
  const [showIPFSModal, setShowIPFSModal] = useState<boolean>(false)
  const [walletAutoConnect, setWalletAutoConnect] = useLocalStorage<boolean | undefined>("walletAutoConnect", undefined)
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

      <MenuItem item sx={{ cursor: "pointer" }} onClick={() => setShowIPFSModal(!showIPFSModal)}>
        <Grid container gap={1} alignItems="center">
          <Avatar sx={{ width: 28, height: 28, background: palette.grays[100] }}>
            <ShortcutIcon sx={{ color: palette.grays[800], width: 20 }} />
          </Avatar>
          <Typography variant="body1">Update IPFS Node</Typography>
        </Grid>
      </MenuItem>

      <MenuItem
        item
        sx={{ cursor: "pointer" }}
        onClick={() => {
          navigate(`/publications`)
        }}
      >
        <Grid container gap={1} alignItems="center">
          <Avatar sx={{ width: 28, height: 28, background: palette.grays[100] }}>
            <ExitToAppIcon sx={{ color: palette.grays[800], width: 18 }} />
          </Avatar>
          <Typography variant="body1">Switch Publication</Typography>
        </Grid>
      </MenuItem>

      <MenuItem
        item
        sx={{ cursor: "pointer" }}
        onClick={() => {
          if (walletAutoConnect) {
            setWalletAutoConnect(undefined)
          }
          deactivate()
        }}
      >
        <Grid container gap={1} alignItems="center">
          <Avatar sx={{ width: 28, height: 28, background: palette.grays[100] }}>
            <LinkOffIcon sx={{ color: palette.primary[800], width: 18 }} />
          </Avatar>
          <Typography variant="body1" color={palette.primary[1000]}>
            Disconnect Wallet
          </Typography>
        </Grid>
      </MenuItem>

      <IPFSNodeModal open={showIPFSModal} onClose={() => setShowIPFSModal(false)} />
    </UserOptionsContainer>
  )
}

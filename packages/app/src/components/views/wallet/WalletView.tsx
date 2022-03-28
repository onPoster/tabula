import { Box, Grid, Typography } from "@mui/material"
import React, { useEffect } from "react"
import { typography } from "../../../theme"
import CloseIcon from "@mui/icons-material/Close"
import { useNavigate } from "react-router-dom"
import WalletButton from "../../commons/WalletButton"
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core"
import { SUPPORTED_WALLETS } from "../../../constants/wallet"
import { AbstractConnector } from "@web3-react/abstract-connector"

const AFTER_CONNECT_SCREEN = "/publication/publish"

export const WalletView: React.FC = () => {
  const navigate = useNavigate()
  const { activate, active } = useWeb3React()

  useEffect(() => {
    if (active) {
      navigate(AFTER_CONNECT_SCREEN)
    }
  }, [active, navigate])

  const handleConnector = async (connector: AbstractConnector) => {
    await activate(connector, undefined, true).catch((error) => {
      if (error instanceof UnsupportedChainIdError && connector) {
        activate(connector)
      }
    })
  }

  return (
    <Grid container justifyContent={"center"} alignItems={"center"} height={"100vh"} gap={24} flexDirection={"column"}>
      <Grid item maxWidth={350} width={"100%"}>
        <Box display="flex" alignItems={"center"} justifyContent={"space-between"} mb={2}>
          <Typography fontFamily={typography.fontFamilies.sans} variant="h5" m={0}>
            Connect your account
          </Typography>
          <CloseIcon style={{ cursor: "pointer" }} onClick={() => navigate(-1)} />
        </Box>
        <Grid container style={{ gap: 16 }}>
          {SUPPORTED_WALLETS.map(({ name, iconURL, connector }, index) => (
            <Grid item key={index} width={"100%"}>
              <WalletButton walletName={name} icon={iconURL} onClick={() => handleConnector(connector)} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  )
}

import { Box, Grid, Modal, styled, Typography } from "@mui/material"
import React, { useEffect, useRef, useState } from "react"
import { palette, typography } from "../../../theme"
import CloseIcon from "@mui/icons-material/Close"
import { useLocation, useNavigate } from "react-router-dom"
import WalletButton from "../../commons/WalletButton"
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core"
import { SUPPORTED_WALLETS } from "../../../constants/wallet"
import { AbstractConnector } from "@web3-react/abstract-connector"
import { usePublicationContext } from "../../../services/publications/contexts"
import useLocalStorage from "../../../hooks/useLocalStorage"
import { Pinning } from "../../../models/pinning"
import { ViewContainer } from "../../commons/ViewContainer"
import { ALL_SUPPORTED_CHAIN_IDS, chainToString } from "../../../constants/chain"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"

const AFTER_CONNECT_SCREEN = "/publication/publish"

const ModalContainer = styled(ViewContainer)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  borderRadius: 8,
  width: 550,
  background: palette.whites[1000],
  padding: 24,
})

const ModalContentContainer = styled(Box)({
  background: palette.secondary[200],
  borderRadius: 4,
  cursor: "pointer",
  padding: 24,
})
export const WalletView: React.FC = () => {
  const navigate = useNavigate()
  const { currentPath } = usePublicationContext()
  const [pinning] = useLocalStorage<Pinning | undefined>("pinning", undefined)
  const [walletAutoConnect, setWalletAutoConnect] = useLocalStorage<boolean | undefined>("walletAutoConnect", undefined)
  const { activate, active } = useWeb3React()
  const search = useLocation().search
  const publicationChainId = new URLSearchParams(search).get("publicationChainId")
  const [showModal, setShowModal] = useState<boolean>(false)
  const ref = useRef(null)

  useEffect(() => {
    if (active) {
      if (currentPath) {
        navigate(currentPath)
      }
      if (currentPath && !pinning) {
        navigate("/pinning")
      }
      if (!currentPath && !pinning) {
        navigate("/pinning")
      }
      if (!currentPath && pinning) {
        navigate(AFTER_CONNECT_SCREEN)
      }
    }
  }, [active, currentPath, navigate, pinning])

  const handleConnector = async (connector: AbstractConnector) => {
    if (publicationChainId != null) {
      try {
        const rawChainIdString = (await connector.getChainId()).toString()
        const currentChainId = rawChainIdString.startsWith("0x")
          ? parseInt(rawChainIdString, 16)
          : parseInt(rawChainIdString)
        if (parseInt(publicationChainId) !== currentChainId) {
          setShowModal(true)
          return
        }
      } catch (error) {
        console.warn("Probably no browser wallet:")
        console.warn(error)
      }
    }
    await activate(connector, undefined, true).catch((error) => {
      if (error instanceof UnsupportedChainIdError && connector) {
        console.error(error)
        setShowModal(true)
      }
    })
    if (!walletAutoConnect) {
      setWalletAutoConnect(true)
    }
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
          {SUPPORTED_WALLETS.map(({ name, iconURL, connector }, index) => {
            if (name === "Metamask" && !window.ethereum) {
              return null
            }
            return (
              <Grid item key={index} width={"100%"}>
                <WalletButton walletName={name} icon={iconURL} onClick={() => handleConnector(connector)} />
              </Grid>
            )
          })}
        </Grid>
      </Grid>
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <ModalContainer maxWidth="sm" ref={ref}>
          <Grid container gap={3} py={3} px={4} flexDirection="column">
            <Grid item>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item sx={{ display: "flex", alignItems: "center" }}>
                  <WarningAmberIcon color="secondary" sx={{ marginRight: 1 }} />
                  <Typography
                    fontFamily={typography.fontFamilies.sans}
                    variant="h6"
                    sx={{ margin: 0 }}
                    color={palette.secondary[1000]}
                  >
                    Warning
                  </Typography>
                </Grid>
                <Grid item>
                  <CloseIcon style={{ cursor: "pointer" }} onClick={() => setShowModal(false)} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <ModalContentContainer>
                <Typography variant="body1" fontWeight={700} color={palette.secondary[1000]}>
                  {publicationChainId != null ? (
                    <Typography>
                      This publication is on {chainToString(Number(publicationChainId))}. Please change your wallet to
                      that network.
                    </Typography>
                  ) : (
                    <Grid item>
                      <Typography>Please, change to one of the supported networks:</Typography>
                      <Grid container flexDirection="column" gap={1}>
                        {ALL_SUPPORTED_CHAIN_IDS.map((chainId) => (
                          <Grid item key={chainId}>
                            <Typography>{chainToString(Number(chainId))}</Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  )}
                </Typography>
              </ModalContentContainer>
            </Grid>
          </Grid>
        </ModalContainer>
      </Modal>
    </Grid>
  )
}

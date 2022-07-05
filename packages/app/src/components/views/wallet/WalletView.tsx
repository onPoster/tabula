import { Box, Grid, Link, Modal, styled, Typography } from "@mui/material"
import React, { useEffect, useState, useRef } from "react"
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
import { ALL_SUPPORTED_CHAIN_IDS, chainToString, switchChain } from "../../../constants/chain"
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
  padding: 24,
})
export const WalletView: React.FC = () => {
  const navigate = useNavigate()
  const { currentPath } = usePublicationContext()
  const [pinning] = useLocalStorage<Pinning | undefined>("pinning", undefined)
  const [walletAutoConnect, setWalletAutoConnect] = useLocalStorage<boolean | undefined>("walletAutoConnect", undefined)
  const { activate, active } = useWeb3React()
  const search = useLocation().search
  const publicationChainIdRaw = new URLSearchParams(search).get("publicationChainId")
  const publicationChainId: number | null = publicationChainIdRaw != null ? parseInt(publicationChainIdRaw) : null
  const [showModal, setShowModal] = useState<boolean>(false)
  const [connector, setConnector] = useState<AbstractConnector | null>(null)
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
    setConnector(connector)
    if (publicationChainId != null) {
      // we are in a publication
      try {
        const rawChainIdString = (await connector.getChainId()).toString()
        const currentChainId = rawChainIdString.startsWith("0x")
          ? parseInt(rawChainIdString, 16)
          : parseInt(rawChainIdString)

        if (publicationChainId !== currentChainId) {
          // we are on the wrong chain
          await switchChain(connector, publicationChainId).then(() => handleConnector(connector))
          return
        }
      } catch (error) {
        console.warn("Probably no browser wallet:")
        console.warn(error)
      }
    }
    await activate(connector, undefined, true).catch((error) => {
      if (error instanceof UnsupportedChainIdError && connector) {
        console.warn(error.message)
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
                {publicationChainId != null ? (
                  <Typography variant="body1" fontWeight={700} color={palette.secondary[1000]}>
                    This publication is on {chainToString(publicationChainId)}. Please change your wallet to that
                    network.
                  </Typography>
                ) : (
                  <Grid item>
                    <Typography variant="body1" fontWeight={700} color={palette.secondary[1000]}>
                      Please, change to one of the supported networks:
                    </Typography>
                    <Grid container flexDirection="column" gap={1}>
                      {ALL_SUPPORTED_CHAIN_IDS.map((chainId) => (
                        <Grid
                          item
                          key={chainId}
                          onClick={() =>
                            connector != null && switchChain(connector, chainId).then(() => handleConnector(connector))
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <Link>{chainToString(Number(chainId))}</Link>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                )}
              </ModalContentContainer>
            </Grid>
          </Grid>
        </ModalContainer>
      </Modal>
    </Grid>
  )
}

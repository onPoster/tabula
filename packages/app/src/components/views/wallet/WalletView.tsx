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
import { ALL_SUPPORTED_CHAIN_IDS } from "../../../constants/chain"

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
  const { activate, active, chainId: currentChainId } = useWeb3React()
  const search = useLocation().search
  const publicationChainId = new URLSearchParams(search).get("publicationChainId")
  const [showModal, setShowModal] = useState<boolean>(false)
  const ref = useRef(null)

  useEffect(() => {
    if (active) {
      if (currentPath) {
        navigate(currentPath)
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
    await activate(connector, undefined, true).catch((error) => {
      if (error instanceof UnsupportedChainIdError && connector) {
        console.error(error)
        setShowModal(true)
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
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <ModalContainer maxWidth="sm" ref={ref}>
          <Grid container gap={3} py={3} px={4} flexDirection="column">
            <Grid item>
              <ModalContentContainer>
                <Typography variant="body1" fontWeight={700} color={palette.secondary[1000]}>
                  {publicationChainId != null ? (
                    <p>This publication is on {publicationChainId}. Please change your wallet to that network.</p>
                  ) : (
                    <>
                      <p>Please, change to one of the supported networks:</p>
                      <ul>
                        {ALL_SUPPORTED_CHAIN_IDS.map((chainId) => (
                          <li key={chainId}>{chainId}</li>
                        ))}
                      </ul>
                    </>
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

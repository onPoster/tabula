import styled from "@emotion/styled"
import { Grid, Modal, ModalProps, Typography } from "@mui/material"
import React, { useRef, useState } from "react"
import { palette, typography } from "../../theme"
import { ViewContainer } from "./ViewContainer"
import CloseIcon from "@mui/icons-material/Close"
import useLocalStorage from "../../hooks/useLocalStorage"
import PinningConfiguration from "./Pinning/PinningConfiguration"
import PinningSelection from "./Pinning/PinningSelection"
import { Pinning } from "../../models/pinning"

const ModalContainer = styled(ViewContainer)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  borderRadius: 8,
  width: 648,
  background: palette.whites[1000],
  padding: 24,
})

export enum PinningConfigurationOption {
  OurPinningService = "ourPinningService",
  CustomPinningService = "customPinningService",
  DirectlyOnChain = "directlyOnChain",
}

export interface PinningConfigurationModalProps extends Omit<ModalProps, "children"> {}

const PinningConfigurationModal: React.FC<PinningConfigurationModalProps> = (props) => {
  const [pinning, setPinning] = useLocalStorage<Pinning | undefined>("pinning", undefined)
  const [, setIsSelectedHowToSaveArticle] = useLocalStorage<boolean | undefined>(
    "isSelectedHowToSaveArticle",
    undefined,
  )
  const [showPinningSelectionModal, setShowPinningSelectionModal] = useState<boolean>(true)
  const [showCustomPinningModal, setShowCustomPinningModal] = useState<boolean>(false)
  const pinningConfModalRef = useRef(null)

  /**
   * Method to handle the back button coming from Custom Pinning Service
   */
  const handlePinningConfigurationBack = () => {
    setIsSelectedHowToSaveArticle(undefined)
    setShowCustomPinningModal(false)
    setShowPinningSelectionModal(true)
  }

  const handleEventClose = () => {
    setShowPinningSelectionModal(true)
    setShowCustomPinningModal(false)
    props.onClose && props.onClose({}, "escapeKeyDown")
  }

  return (
    <Modal open={props.open} onClose={handleEventClose}>
      <ModalContainer maxWidth="md" ref={pinningConfModalRef}>
        <Grid container spacing={3} py={3} px={4} flexDirection="column">
          <Grid item>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Typography
                  fontFamily={typography.fontFamilies.sans}
                  variant="h5"
                  sx={{ margin: 0 }}
                  color={palette.grays[1000]}
                >
                  Configure Pinning Service
                </Typography>
              </Grid>
              <Grid item>
                <CloseIcon style={{ cursor: "pointer" }} onClick={handleEventClose} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            {showPinningSelectionModal && (
              <PinningSelection
                onCustomSelection={() => {
                  setShowPinningSelectionModal(false)
                  setShowCustomPinningModal(true)
                }}
                onClose={handleEventClose}
              />
            )}
            {showCustomPinningModal && (
              <PinningConfiguration onBack={handlePinningConfigurationBack} onClose={handleEventClose} />
            )}
          </Grid>
        </Grid>
      </ModalContainer>
    </Modal>
  )
}

export default PinningConfigurationModal

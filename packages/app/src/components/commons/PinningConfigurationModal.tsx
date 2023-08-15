import styled from "@emotion/styled"
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Modal,
  ModalProps,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material"
import React, { useRef, useState } from "react"
import { palette, typography } from "../../theme"
import { ViewContainer } from "./ViewContainer"
import CloseIcon from "@mui/icons-material/Close"
import useLocalStorage from "../../hooks/useLocalStorage"
import { useNavigate } from "react-router-dom"

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

const PinningConfContainer = styled(Box)({
  background: palette.secondary[200],
  borderRadius: 4,
  padding: 24,
})

const StyledButton = styled(Button)({
  background: palette.secondary[200],
  borderRadius: 4,
  display: "inline-flex",
  cursor: "pointer",
  padding: "4px 16px",
  "&:hover": {
    background: palette.secondary[100],
  },
})

export enum PinningConfigurationOption {
  OurPinningService = "ourPinningService",
  CustomPinningService = "customPinningService",
  DirectlyOnChain = "directlyOnChain",
}

export interface PinningConfigurationModalProps extends Omit<ModalProps, "children"> {}

const PinningConfigurationModal: React.FC<PinningConfigurationModalProps> = (props) => {
  const navigate = useNavigate()
  const [pinningOptionSelected, setPinningOptionSelected] = useLocalStorage<PinningConfigurationOption | undefined>(
    "pinningOptionSelected",
    undefined,
  )
  const [pinningConfSelection, setPinningConfSelection] = useState<PinningConfigurationOption>(
    pinningOptionSelected ?? PinningConfigurationOption.OurPinningService,
  )
  const pinningConfModalRef = useRef(null)

  const handlePinningSelection = () => {
    setPinningOptionSelected(pinningConfSelection)
    if (pinningConfSelection === PinningConfigurationOption.CustomPinningService) {
      navigate("/pinning")
    }
    if (props.onClose) {
      props.onClose(
        {
          pinningOptionSelected: pinningConfSelection,
        },
        "backdropClick",
      )
    }
  }

  const changeSelection = (_event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setPinningConfSelection(value as PinningConfigurationOption)
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
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
                  Choose store option
                </Typography>
              </Grid>
              <Grid item>
                <CloseIcon
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    props.onClose && props.onClose({}, "escapeKeyDown")
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <PinningConfContainer>
              <FormControl>
                <RadioGroup
                  aria-labelledby="pinning-service-user-selection"
                  defaultValue={pinningConfSelection}
                  name="pinning-service-user-selection"
                  onChange={changeSelection}
                >
                  <FormControlLabel
                    value={PinningConfigurationOption.OurPinningService}
                    control={
                      <Radio
                        sx={{
                          "&, &.Mui-checked": {
                            color: palette.secondary[1000],
                          },
                        }}
                      />
                    }
                    sx={{ color: palette.secondary[1000], fontFamily: typography.fontFamilies.sans }}
                    label={
                      <>
                        <span style={{ fontWeight: "bold" }}>Utilize Our Pinning Service:</span> Benefit from a
                        hassle-free experience with no setup required, all provided by us. Please note content may not
                        be permanent.
                      </>
                    }
                  />
                  <FormControlLabel
                    value={PinningConfigurationOption.CustomPinningService}
                    control={
                      <Radio
                        sx={{
                          "&, &.Mui-checked": {
                            color: palette.secondary[1000],
                          },
                        }}
                      />
                    }
                    sx={{ color: palette.secondary[1000], fontFamily: typography.fontFamilies.sans }}
                    label={
                      <>
                        <span style={{ fontWeight: "bold" }}>Set Up a Custom Pinning Service:</span> Trust your
                        preferred service for more personalized control.
                      </>
                    }
                  />
                  <FormControlLabel
                    value={PinningConfigurationOption.DirectlyOnChain}
                    control={
                      <Radio
                        sx={{
                          "&, &.Mui-checked": {
                            color: palette.secondary[1000],
                          },
                        }}
                      />
                    }
                    sx={{ color: palette.secondary[1000], fontFamily: typography.fontFamilies.sans }}
                    label={
                      <>
                        <span style={{ fontWeight: "bold" }}>Post the Article Directly on Chain:</span> Keep in mind,
                        this is more expensive, and images are not supported.
                      </>
                    }
                  />
                </RadioGroup>
              </FormControl>
              <StyledButton sx={{ mt: 4 }}>
                <Typography
                  variant="body1"
                  fontFamily={typography.fontFamilies.sans}
                  fontWeight={700}
                  color={palette.secondary[1000]}
                  onClick={handlePinningSelection}
                >
                  Setup Pinning Service
                </Typography>
              </StyledButton>
            </PinningConfContainer>
          </Grid>
        </Grid>
      </ModalContainer>
    </Modal>
  )
}

export default PinningConfigurationModal

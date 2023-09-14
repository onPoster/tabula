import styled from "@emotion/styled"
import { Box, Button, Divider, FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material"
import React, { useState } from "react"
import { Pinning, PinningService } from "../../../models/pinning"
import useLocalStorage from "../../../hooks/useLocalStorage"
import { typography } from "../../../theme"

const PinningConfContainer = styled(Box)({
  borderRadius: 4,
  padding: 24,
})

export enum PinningConfigurationOption {
  OurPinningService = "ourPinningService",
  CustomPinningService = "customPinningService",
  DirectlyOnChain = "directlyOnChain",
}

type PinningSelectionProps = {
  onCustomSelection: () => void
  onClose: () => void
}

const PinningSelection: React.FC<PinningSelectionProps> = ({ onCustomSelection, onClose }) => {
  const [, setIsSelectedHowToSaveArticle] = useLocalStorage<boolean | undefined>(
    "isSelectedHowToSaveArticle",
    undefined,
  )
  const [pinning, setPinning] = useLocalStorage<Pinning | undefined>("pinning", undefined)
  const handleDefaultPinningConfSelection = (): PinningConfigurationOption => {
    if (pinning) {
      const { service } = pinning
      if (service === PinningService.NONE) {
        return PinningConfigurationOption.DirectlyOnChain
      }
      if (service === PinningService.PUBLIC) {
        return PinningConfigurationOption.OurPinningService
      }
      if (![PinningService.PUBLIC, PinningService.NONE].includes(service)) {
        return PinningConfigurationOption.CustomPinningService
      }
    }
    return PinningConfigurationOption.OurPinningService
  }
  const [pinningConfSelection, setPinningConfSelection] = useState<PinningConfigurationOption>(
    handleDefaultPinningConfSelection(),
  )

  const handlePinningSelection = () => {
    setIsSelectedHowToSaveArticle(true)
    if (pinningConfSelection === PinningConfigurationOption.CustomPinningService) {
      return onCustomSelection()
    }
    if (pinningConfSelection === PinningConfigurationOption.DirectlyOnChain) {
      setPinning({ service: PinningService.NONE, accessToken: "", endpoint: "" })
    }
    if (pinningConfSelection === PinningConfigurationOption.OurPinningService) {
      setPinning({ service: PinningService.PUBLIC, accessToken: "", endpoint: "" })
    }
    onClose()
  }

  const changeSelection = (_event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setPinningConfSelection(value as PinningConfigurationOption)
  }

  return (
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
            control={<Radio sx={{ pt: "3px", pb: 0 }} />}
            sx={{ fontFamily: typography.fontFamilies.sans, display: "flex", alignItems: "flex-start" }}
            label={
              <>
                <span style={{ fontWeight: "bold" }}>Utilize Our Pinning Service (Default):</span> Benefit from a
                hassle-free experience with no setup required, all provided by us. Please note content may not be
                permanent.
              </>
            }
          />
          <FormControlLabel
            value={PinningConfigurationOption.CustomPinningService}
            control={<Radio sx={{ pt: "3px", pb: 0 }} />}
            sx={{ fontFamily: typography.fontFamilies.sans, display: "flex", alignItems: "flex-start" }}
            label={
              <>
                <span style={{ fontWeight: "bold" }}>Set Up a Custom Pinning Service (Advanced):</span> Trust your
                preferred service for more personalized control.
              </>
            }
          />
          <FormControlLabel
            value={PinningConfigurationOption.DirectlyOnChain}
            control={<Radio sx={{ pt: "3px", pb: 0 }} />}
            sx={{ fontFamily: typography.fontFamilies.sans, display: "flex", alignItems: "flex-start" }}
            label={
              <>
                <span style={{ fontWeight: "bold" }}>Post the Article Directly on Chain (Not Recommended):</span> Keep
                in mind, this is more expensive, and images are not supported.
              </>
            }
          />
        </RadioGroup>
      </FormControl>
      <Divider sx={{ my: 4 }} />
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <Button variant="contained" onClick={handlePinningSelection}>
          Continue
        </Button>
      </Box>
    </PinningConfContainer>
  )
}

export default PinningSelection

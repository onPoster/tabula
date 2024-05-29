import { Box, Grid, Typography, TextField, Divider, Button, styled } from "@mui/material"

import React, { useState } from "react"

import { Pinning, PinningService, PinningServiceEndpoint } from "@/models/pinning"
import { typography, palette } from "@/theme"

import { ExternalLink } from "@/components/commons/ExternalLink"
import useLocalStorage from "@/hooks/useLocalStorage"
import { useNotification } from "@/hooks/useNotification"
import { useIPFSContext } from "@/services/ipfs/context"

export const AlertContainer = styled(Box)({
  background: palette.secondary[200],
  borderRadius: 4,
  padding: 24,
})

const BackButton = styled(Button)({
  border: `2px solid ${palette.grays[400]}`,
  background: palette.whites[400],
  color: palette.grays[800],
  "&:hover": {
    background: palette.whites[1000],
  },
})

type PinningConfigurationProps = {
  onBack: () => void
  onClose: () => void
}

const PinningConfiguration: React.FC<PinningConfigurationProps> = ({ onBack, onClose }) => {
  const currentSelection: PinningService = PinningService.PINATA
  // const [currentSelection, setCurrentSelection] = useState<PinningService | undefined>(PinningService.PINATA)
  const [, setPinning] = useLocalStorage<Pinning | undefined>("pinning", undefined)
  const [token, setToken] = useState<string>("")

  // const { isValidIpfsService } = useIpfs()
  const { isValidIpfsService } = useIPFSContext()
  const openNotification = useNotification()

  const onSubmitHandler = async () => {
    if (!token && token === "") return
    const data: Pinning = {
      service: PinningService.PINATA,
      endpoint: PinningServiceEndpoint.PINATA,
      accessToken: token,
    }
    const isValid = await isValidIpfsService(data)
    if (!isValid) {
      openNotification({
        message: "We couldn't connect to the pinning service that you provided us.",
        variant: "error",
        autoHideDuration: 2000,
      })
      return
    }
    setPinning(data)
    openNotification({
      message: "Successfully set up the pinning service!",
      variant: "success",
      autoHideDuration: 2000,
    })
    onClose()
  }
  return (
    <Box>
      <Grid container gap={3}>
        <Grid item width={"100%"}>
          <Typography variant="body1">
            You can provide an endpoint to a pinning service in adherence with IPFS&#39;s pinning services{" "}
            <ExternalLink
              link="https://ipfs.github.io/pinning-services-api-spec/"
              style={{
                color: palette.secondary[1000],
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              API spec.
            </ExternalLink>
          </Typography>
        </Grid>

        {currentSelection === PinningService.PINATA && (
          <Grid item width={"100%"}>
            <AlertContainer>
              <Typography variant="body1" fontWeight={500} color={palette.secondary[1000]}>
                Tabula requires the following Pinata permissions:{<br />} - pinFileToIPFS{<br />} - pinJSONToIPFS
                {<br />} - addPinObject{<br />} - getPinObject {<br />} - listPinObjects
              </Typography>
            </AlertContainer>
          </Grid>
        )}

        <Grid item width={"100%"}>
          <Grid container flexDirection="column" justifyContent="center" gap={2}>
            <Grid item>
              <Grid container flexDirection="row" justifyContent="space-between" alignItems="center">
                <Grid item xs={12} md={6}>
                  <Typography variant="body1" fontWeight="bold" fontFamily={typography.fontFamilies.sans}>
                    Pinning Service
                    <Typography component="span" sx={{ color: palette.primary[1000] }}>
                      *
                    </Typography>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField value={"Pinata"} disabled sx={{ width: "100%" }} />
                </Grid>
              </Grid>
            </Grid>

            <Grid item>
              <Grid container flexDirection="row" justifyContent="space-between" alignItems="center">
                <Grid item xs={12} md={6}>
                  <Typography variant="body1" fontWeight="bold" fontFamily={typography.fontFamilies.sans}>
                    Secret Access Token{" "}
                    <Typography component="span" sx={{ color: palette.primary[1000] }}>
                      *
                    </Typography>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    sx={{ width: "100%" }}
                    type="password"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item width={"100%"}>
          <Divider />
        </Grid>
        <Grid item width={"100%"}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <BackButton variant="contained" onClick={onBack}>
              Back
            </BackButton>
            <Button variant="contained" disabled={!token} onClick={onSubmitHandler} type="submit">
              Continue
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default PinningConfiguration

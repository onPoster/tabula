import { Box, Grid, Typography, FormHelperText, TextField, Divider, Button, styled } from "@mui/material"

import React, { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { PINNING_OPTIONS } from "../../../constants/pinning"
import { Pinning, PinningService, PinningServiceEndpoint } from "../../../models/pinning"
import { typography, palette } from "../../../theme"
import { Dropdown } from "../Dropdown"
import { ExternalLink } from "../ExternalLink"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import useLocalStorage from "../../../hooks/useLocalStorage"
import { useIpfs } from "../../../hooks/useIpfs"
import { useNotification } from "../../../hooks/useNotification"

const AlertContainer = styled(Box)({
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

const setupIpfsSchema = yup.object().shape({
  service: yup.string().required(),
  endpoint: yup.string().when("service", {
    is: (service: PinningService) => ![PinningService.NONE, PinningService.PUBLIC].includes(service),
    then: yup.string().required("API Endpoint Is A Required Field"),
    otherwise: yup.string().notRequired(),
  }),
  accessToken: yup.string().when("service", {
    is: (service: PinningService) => ![PinningService.NONE, PinningService.PUBLIC].includes(service),
    then: yup.string().required("Secret Access Token Is A Required Field"),
    otherwise: yup.string().notRequired(),
  }),
})

type PinningConfigurationProps = {
  onBack: () => void
  onClose: () => void
}

const PinningConfiguration: React.FC<PinningConfigurationProps> = ({ onBack, onClose }) => {
  const [currentSelection, setCurrentSelection] = useState<PinningService | undefined>(undefined)
  const [pinning, setPinning] = useLocalStorage<Pinning | undefined>("pinning", undefined)
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: pinning,
    resolver: yupResolver(setupIpfsSchema),
  })
  const { isValidIpfsService } = useIpfs()
  const openNotification = useNotification()
  const handleSelected = (selected: PinningService) => {
    setCurrentSelection(selected)
    setValue("service", selected)
    if (![PinningService.NONE, PinningService.PUBLIC].includes(selected)) {
      if (selected === PinningService.CUSTOM) {
        setValue("endpoint", pinning?.endpoint ?? "")
      } else {
        setValue("endpoint", PinningServiceEndpoint[selected])
      }
    }
  }

  const onSubmitHandler = async (data: Pinning) => {
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
      <form style={{ width: "100%" }} onSubmit={handleSubmit((data) => onSubmitHandler(data as Pinning))}>
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
                    <Controller
                      control={control}
                      name="service"
                      render={({ field }) => (
                        <Dropdown
                          title="Select A Pinning Service"
                          options={PINNING_OPTIONS}
                          onSelected={(e) => {
                            handleSelected(e.value as PinningService)
                          }}
                          {...field}
                        />
                      )}
                      rules={{ required: true }}
                    />
                    {errors && errors.service && (
                      <FormHelperText sx={{ textTransform: "capitalize" }}>
                        Pinning Service Is A Required Field
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </Grid>
              {currentSelection === PinningService.CUSTOM && (
                <Grid item>
                  <Grid container flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Grid item xs={12} md={6}>
                      <Typography variant="body1" fontWeight="bold" fontFamily={typography.fontFamilies.sans}>
                        API endpoint{" "}
                        <Typography component="span" sx={{ color: palette.primary[1000] }}>
                          *
                        </Typography>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        control={control}
                        name="endpoint"
                        render={({ field }) => (
                          <TextField {...field} sx={{ width: "100%" }} placeholder="https://api.pinata.cloud/psa" />
                        )}
                        rules={{ required: true }}
                      />
                      {errors && errors.endpoint && (
                        <FormHelperText sx={{ textTransform: "capitalize" }}>
                          API Endpoint Is A Required Field
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              )}
              {currentSelection !== PinningService.NONE && currentSelection !== PinningService.PUBLIC && (
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
                      <Controller
                        control={control}
                        name="accessToken"
                        render={({ field }) => <TextField {...field} sx={{ width: "100%" }} type="password" />}
                        rules={{ required: true }}
                      />
                      {errors && errors.accessToken && (
                        <FormHelperText sx={{ textTransform: "capitalize" }}>
                          Secret Access Token Is A Required Field
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              )}
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
              <Button variant="contained" type="submit">
                Continue
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default PinningConfiguration

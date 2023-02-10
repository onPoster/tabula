import React, { useRef, useState } from "react"
import { Box, Grid, Typography, styled, TextField, FormHelperText, Divider, Button, Modal } from "@mui/material"
import { ExternalLink } from "../../commons/ExternalLink"
import { useNavigate } from "react-router-dom"
import { palette, typography } from "../../../theme"
import { ViewContainer } from "../../commons/ViewContainer"
import Page from "../../layout/Page"
import CloseIcon from "@mui/icons-material/Close"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { Controller, useForm } from "react-hook-form"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import { Pinning, PinningService, PinningServiceEndpoint } from "../../../models/pinning"
import useLocalStorage from "../../../hooks/useLocalStorage"
import { usePublicationContext } from "../../../services/publications/contexts"
import { useNotification } from "../../../hooks/useNotification"
import { useIpfs } from "../../../hooks/useIpfs"
import { Dropdown } from "../../commons/Dropdown"
import { PINNING_OPTIONS } from "../../../constants/pinning"

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

const StyledLinkButton = styled(Box)({
  color: palette.secondary[1000],
  textDecoration: "underline",
  cursor: "pointer",
  "&:hover": {
    color: palette.secondary[800],
  },
})

const setupIpfsSchema = yup.object().shape({
  service: yup.string().required(),
  endpoint: yup.string().required(),
  accessToken: yup.string().required(),
})

const AlertContainer = styled(Box)({
  background: palette.secondary[200],
  borderRadius: 4,
  padding: 24,
})

const SetupIpfsView: React.FC = () => {
  const navigate = useNavigate()
  const ref = useRef(null)
  const openNotification = useNotification()
  const { isValidIpfsService } = useIpfs()
  const { currentPath, setCurrentPath } = usePublicationContext()
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
  const [showModal, setShowModal] = useState<boolean>(false)
  const [currentSelection, setCurrentSelection] = useState<PinningService | undefined>(undefined)

  const handleSelected = (selected: PinningService) => {
    setCurrentSelection(selected)
    setValue("service", selected)
    setValue("endpoint", PinningServiceEndpoint[selected])
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
    if (currentPath) {
      navigate(currentPath)
      setCurrentPath(undefined)
      return
    }
    navigate("/publications")
  }

  const handleClose = () => {
    if (currentPath) {
      navigate(currentPath)
      setCurrentPath(undefined)
      return
    }

    if (!currentPath) {
      navigate("/publications")
      return
    }
    if (!currentPath && !showModal) {
      setShowModal(true)
      return
    }
  }

  return (
    <Page>
      <ViewContainer maxWidth="sm">
        <form style={{ width: "100%" }} onSubmit={handleSubmit((data) => onSubmitHandler(data as Pinning))}>
          <Grid container gap={3} mt={currentSelection === PinningService.PINATA ? 8 : 19}>
            <Grid item width={"100%"}>
              <Grid container justifyContent="space-between" alignItems={"center"}>
                <Typography fontFamily={typography.fontFamilies.sans} variant="h5" m={0}>
                  Setup Pinning Service
                </Typography>
                <CloseIcon style={{ cursor: "pointer" }} onClick={handleClose} />
              </Grid>
            </Grid>
            <Grid item width={"100%"}>
              <Typography variant="body1">
                You can provide an endpoint to a pinning service in adherence with IPFS&#39;s{" "}
                <ExternalLink link="https://ipfs.github.io/pinning-services-api-spec/">
                  pinning services API spec.
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
              </Grid>
            </Grid>
            <Grid item width={"100%"}>
              <Divider />
            </Grid>
            <Grid item width={"100%"}>
              <Grid container alignItems="center" justifyContent="space-between">
                <StyledLinkButton onClick={() => setShowModal(true)}>Don&#39;t use IPFS</StyledLinkButton>
                <Button variant="contained" type="submit">
                  Continue
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </ViewContainer>
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
                  It is not recommended to publish an article without a configured pinning service. Without a configured
                  pinning service, your transactions will be much more expensive.
                </Typography>
              </ModalContentContainer>
            </Grid>
            <Grid item>
              <Divider />
            </Grid>
            <Grid item>
              <StyledLinkButton
                onClick={() => {
                  setPinning(undefined)
                  handleClose()
                }}
              >
                I understand, and I&#39;d like to continue without setting up IPFS.
              </StyledLinkButton>
            </Grid>
          </Grid>
        </ModalContainer>
      </Modal>
    </Page>
  )
}

export default SetupIpfsView

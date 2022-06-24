import React from "react"
import { OptionsObject, useSnackbar } from "notistack"
import { ExternalLink } from "../components/commons/ExternalLink"
import { Grid, styled } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import { usePosterContext } from "../services/poster/context"

const CloseStyledIcon = styled(CloseIcon)({
  color: "#fff",
})

const ExpandIcon = styled(OpenInNewIcon)({
  color: "#fff",
  fontSize: 25,
})

const NotificationActions = ({ detailsLink, onClose }: { detailsLink?: string; onClose: () => void }) => (
  <Grid container alignItems="center">
    <Grid item>
      {detailsLink ? (
        <ExternalLink link={detailsLink}>
          <ExpandIcon />
        </ExternalLink>
      ) : null}
    </Grid>

    <Grid sx={{ cursor: "pointer" }} onClick={onClose}>
      <CloseStyledIcon />
    </Grid>
  </Grid>
)

interface NotificationParams extends OptionsObject {
  message: string
  detailsLink?: string
}

export const useNotification = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const open = ({ message, detailsLink, ...options }: NotificationParams) => {
    const key = enqueueSnackbar(message, {
      ...options,
      persist: true,
      action: <NotificationActions detailsLink={detailsLink} onClose={() => closeSnackbar(key)} />,
    })

    return { key, closeSnackbar }
  }

  return open
}

export const useShowSuccessNotification = () => {
  const { transactionUrl } = usePosterContext()
  const openNotification = useNotification()
  return openNotification({
    message: "Execute transaction confirmed!",
    autoHideDuration: 5000,
    variant: "success",
    detailsLink: transactionUrl,
  })
}

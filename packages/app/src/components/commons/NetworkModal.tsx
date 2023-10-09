import { Button, CircularProgress, Grid, Modal, Typography, styled } from "@mui/material"
import React, { useRef, useState } from "react"
import { palette, typography } from "../../theme"
import { ViewContainer } from "./ViewContainer"
import CloseIcon from "@mui/icons-material/Close"
import { useWeb3React } from "@web3-react/core"
import { useNotification } from "../../hooks/useNotification"

type NetworkError = {
  code: number
  message: string
  stack: string
}

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

const NetworkModal: React.FC<any> = ({ open, handleClose }) => {
  const ref = useRef(null)
  const openNotification = useNotification()
  const { library } = useWeb3React()
  const [loading, setLoading] = useState<boolean>(false)

  const handleSwitch = async () => {
    if (library) {
      try {
        setLoading(true)
        await library.send("wallet_switchEthereumChain", [{ chainId: "0x1" }])
        handleClose({}, "escapeKeyDown")
      } catch (switchError: unknown) {
        const error = switchError as NetworkError
        setLoading(false)
        openNotification({
          message: error.message,
          variant: "error",
        })
        if (error && error.code === 4902) {
          setLoading(false)
          try {
            await library.send("wallet_addEthereumChain", [
              {
                chainId: "0x1",
              },
            ])
          } catch (addError) {
            console.error(addError)
            setLoading(false)
          }
        }
      }
    }
  }
  return (
    <Modal open={open} onClose={handleClose}>
      <ModalContainer maxWidth="md" ref={ref}>
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
                  Network Switch Required
                </Typography>
              </Grid>
              <Grid item>
                <CloseIcon
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    !loading && handleClose({}, "escapeKeyDown")
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item>
            <Grid container gap={1}>
              <Typography fontFamily={typography.fontFamilies.sans}>
                <p>
                  You are currently connected to a network other than mainnet. To proceed with transactions involving
                  ENS domains, please switch to mainnet.
                </p>
              </Typography>
            </Grid>
          </Grid>

          <Grid item>
            <Button variant="contained" type="submit" onClick={handleSwitch} disabled={loading}>
              {loading && <CircularProgress size={20} sx={{ marginRight: 1 }} />}
              Switch Network
            </Button>
          </Grid>
        </Grid>
      </ModalContainer>
    </Modal>
  )
}

export default NetworkModal

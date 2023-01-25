/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Divider, Grid, Link, Modal, ModalProps, styled, TextField, Typography } from "@mui/material"
import React, { useEffect, useRef, useState } from "react"

import { palette, typography } from "../../theme"
import { ViewContainer } from "./ViewContainer"
import CloseIcon from "@mui/icons-material/Close"
import useLocalStorage from "../../hooks/useLocalStorage"
import { useNotification } from "../../hooks/useNotification"

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

export interface IPFSNodeModalProps extends Omit<ModalProps, "children"> {}

const IPFSNodeModal: React.FC<IPFSNodeModalProps> = (props) => {
  const ref = useRef(null)
  const [ipfsNodeEndpoint, setIpfsNodeEndpoint] = useLocalStorage<string | undefined>("ipfsNodeEndpoint", undefined)
  const [endpoint, setEndpoint] = useState<string>("")
  const openNotification = useNotification()
  useEffect(() => {
    if (ipfsNodeEndpoint && !endpoint) {
      setEndpoint(ipfsNodeEndpoint)
    }
  }, [])

  const handleIpfsNode = () => {
    setIpfsNodeEndpoint(endpoint !== "" ? endpoint : undefined)
    if (props.onClose) {
      props.onClose({}, "backdropClick")
    }
    openNotification({
      message: "IPFS node endpoint successfully updated",
      autoHideDuration: 5000,
      variant: "success",
      preventDuplicate: true,
    })
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
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
                  Update IPFS Node
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
            <Grid container gap={1}>
              <Typography>
                Configure your IPFS node URL below. Tabula will automatically connect to your locale IPFS node if you
                have a node running at the following default endpoint:
              </Typography>
              <Typography fontWeight={700} fontFamily={typography.fontFamilies.monospace} color={palette.grays[800]}>
                http://localhost:5001/api/v0
              </Typography>
            </Grid>
          </Grid>

          <Grid item>
            <Typography>
              Otherwise, you can specify a custom endpoint below or just allow Tabula to connect to{" "}
              <Link fontFamily={typography.fontFamilies.serif} target="_blank" href="https://www.infura.io/">
                Infura
              </Link>{" "}
              by default.
            </Typography>
          </Grid>

          <Grid item>
            <Grid container spacing={3} flexDirection={"row"} alignItems="center">
              <Grid item md={4}>
                <Typography
                  fontFamily={typography.fontFamilies.sans}
                  variant="h6"
                  fontSize={16}
                  sx={{ margin: 0 }}
                  color={palette.grays[1000]}
                >
                  IPFS Node endpoint
                </Typography>
              </Grid>
              <Grid item md={8}>
                <TextField
                  placeholder="http://localhost:5001/api/v0"
                  fullWidth
                  value={endpoint}
                  onChange={(event) => setEndpoint(event.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item>
            <Divider />
          </Grid>

          <Grid item>
            <Grid container justifyContent="flex-end">
              <Button variant="contained" onClick={handleIpfsNode}>
                Update IPFS Node
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </ModalContainer>
    </Modal>
  )
}

export default IPFSNodeModal

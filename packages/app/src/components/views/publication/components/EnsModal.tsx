import { Button, CircularProgress, Grid, Modal, ModalProps, Typography, styled } from "@mui/material"
import React, { useEffect, useRef, useState } from "react"
import { palette, typography } from "@/theme"
import { ViewContainer } from "@/components/commons/ViewContainer"
import CloseIcon from "@mui/icons-material/Close"
import { useEnsContext } from "@/services/ens/context"
import useENS from "@/services/ens/hooks/useENS"
import { Dropdown } from "@/components/commons/Dropdown"
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers5/react"
import { TransactionStatus } from "@/hooks/useContract"

interface EnsModalProps extends Omit<ModalProps, "children"> {
  publicationId: string
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

const EnsModal: React.FC<EnsModalProps> = ({ publicationId, ...props }) => {
  const { setTextRecord, txLoading, status } = useENS()
  const { chainId } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()
  const ref = useRef(null)
  const { ensNameList } = useEnsContext()
  const [ensNameSelected, setEnsNameSelected] = useState<string>("")

  useEffect(() => {
    if (status === TransactionStatus.Success) {
      props.onClose && props.onClose({}, "backdropClick")
    }
  }, [props, status])

  const handleEnsRecord = async () => {
    if (walletProvider && ensNameSelected && chainId) {
      await setTextRecord(ensNameSelected, publicationId)
    }
  }

  return (
    <Modal
      open={props.open}
      onClose={() => {
        if (!txLoading) {
          props.onClose && props.onClose({}, "backdropClick")
        }
      }}
    >
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
                  Linking Your Publication to Your ENS Name
                </Typography>
              </Grid>
              <Grid item>
                <CloseIcon
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (!txLoading) {
                      props.onClose && props.onClose({}, "escapeKeyDown")
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item>
            <Dropdown
              title="Select an ENS name"
              options={ensNameList}
              onSelected={(e) => {
                setEnsNameSelected(e.value)
              }}
            />
          </Grid>

          <Grid item>
            <Grid container gap={1}>
              <Typography fontFamily={typography.fontFamilies.sans}>
                We're registering a record to your ENS name with the publication ID. This allows direct access to your
                publication via{" "}
                <span
                  style={{
                    color: palette.secondary[1000],
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  tabula.gg/#/{ensNameSelected ?? "yourENS"}
                </span>
                .
              </Typography>
            </Grid>
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              type="submit"
              onClick={handleEnsRecord}
              disabled={txLoading || !ensNameSelected}
            >
              {txLoading && <CircularProgress size={20} sx={{ marginRight: 1 }} />}
              Continue
            </Button>
          </Grid>
        </Grid>
      </ModalContainer>
    </Modal>
  )
}

export default EnsModal

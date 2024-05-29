import { Link, useNavigate } from "react-router-dom"
import { Box, Button, Container, Grid } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { ReactComponent as Logo } from "@/assets/images/tabula-logo-wordmark.svg"
import { WalletBadge } from "@/components/commons/WalletBadge"

import { useEffect, useRef, useState } from "react"
import { UserOptions } from "@/components/commons/UserOptions"
import { useWeb3ModalAccount } from "@web3modal/ethers5/react"
import { useWeb3Modal } from "@web3modal/ethers5/react"

const useStyles = makeStyles(() => ({
  logo: {
    display: "flex",
    alignItems: "center",
    transition: "opacity 0.25s ease-in-out",
    "&:hover": {
      opacity: 0.6,
    },
    "& > *": {
      display: "block",
      maxWidth: 160,
    },
  },
}))

type Props = {
  logoColor: string
  showBadge?: boolean
}

const Header: React.FC<Props> = ({ logoColor, showBadge }) => {
  const { address, isConnected } = useWeb3ModalAccount()

  const { open } = useWeb3Modal()
  const navigate = useNavigate()
  const classes = useStyles()
  const [show, setShow] = useState<boolean>(false)
  const ref = useRef<React.Ref<unknown> | undefined>()

  useEffect(() => {
    if (isConnected) {
      navigate(`/publications`)
    }
  }, [isConnected, navigate])

  return (
    <Container
      maxWidth="lg"
      component="header"
      sx={{
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
        mt: 6,
        position: "relative",
        zIndex: 2,
      }}
    >
      <Link to="/" style={{ color: logoColor }}>
        <Box className={classes.logo}>
          <Logo height="70" fill={logoColor} />
        </Box>
      </Link>

      {address && showBadge && (
        <Grid
          container
          flexDirection="column"
          alignItems={"end"}
          justifyContent={"flex-end"}
          sx={{ position: "relative" }}
        >
          <Grid item sx={{ cursor: "pointer" }} onClick={() => setShow(!show)}>
            <WalletBadge hover address={address} />
          </Grid>
          {show && (
            <Grid item sx={{ position: "absolute", top: 45 }}>
              <Box ref={ref}>
                <UserOptions onClose={() => setShow(false)} />
              </Box>
            </Grid>
          )}
        </Grid>
      )}

      {!isConnected && (
        <Button variant="contained" onClick={() => open()}>
          Connect Wallet
        </Button>
      )}
    </Container>
  )
}

export default Header

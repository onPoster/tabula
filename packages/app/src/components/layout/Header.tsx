import { Link, useNavigate } from "react-router-dom"
import { Box, Button, Container, Grid } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { ReactComponent as Logo } from "../../assets/images/tabula-logo-wordmark.svg"
import { useWeb3React } from "@web3-react/core"
import { WalletBadge } from "../commons/WalletBadge"

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
  const { account, active } = useWeb3React()
  const navigate = useNavigate()
  const classes = useStyles()
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
          <Logo height="70" />
        </Box>
      </Link>

      {account && showBadge && (
        <Grid display={"flex"} alignItems={"center"}>
          <WalletBadge address={account} />
        </Grid>
      )}

      {!active && (
        <Button variant="contained" onClick={() => navigate("/wallet")}>
          Connect Wallet
        </Button>
      )}
    </Container>
  )
}

export default Header

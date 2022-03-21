import { Link, useNavigate } from "react-router-dom"
import { Avatar, Box, Button, Container, Grid, Typography } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { shortAddress } from "../../utils/string"
import { ReactComponent as Logo } from "../../assets/images/tabula-logo-wordmark.svg"
import { useWeb3React } from "@web3-react/core"
import { palette, typography } from "../../theme"
import * as blockies from "blockies-ts"

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
}

const Header: React.FC<Props> = ({ logoColor }) => {
  const { account, active } = useWeb3React()
  const navigate = useNavigate()
  const classes = useStyles()
  const avatarSrc = account && blockies.create({ seed: account }).toDataURL()
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

      {account && (
        <Grid display={"flex"} alignItems={"center"}>
          {avatarSrc && <Avatar alt="avatar" src={avatarSrc} />}
          <Typography color={palette.whites[1000]} fontFamily={typography.fontFamilies.sans} variant="h6" m={0} ml={2}>
            {shortAddress(account)}
          </Typography>
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

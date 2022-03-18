import { Link } from "react-router-dom"
import { Box, Button, Container } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { shortAddress } from "../../utils/string"
import { ReactComponent as Logo } from "../../assets/images/tabula-logo-wordmark.svg"

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
  address?: string
}

const Header: React.FC<Props> = ({ logoColor, address }) => {
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

      {address ? (
        <div className="publisher-link">
          <Link to={`/${address}`}>
            <p>{shortAddress(address)}</p>
          </Link>
        </div>
      ) : (
        <Button variant="contained">Connect Wallet</Button>
      )}
    </Container>
  )
}

export default Header

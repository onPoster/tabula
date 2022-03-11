import { Link } from "react-router-dom";
import { Box, Button, Container, CssBaseline, ThemeProvider } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { shortAddress } from "../../utils/string";
import logo from "../../assets/images/tabula-logo-white-wordmark-logomark.png";
import { day } from "../../theme/day"
import "./Page.css";

const useStyles = makeStyles(() => ({
  logo: {
    display: 'flex',
    alignItems: 'center',
    transition: 'opacity 0.25s ease-in-out',
    '&:hover': {
      opacity: 0.6,
    },
    '& img': {
      display: 'block',
      maxWidth: 160,
    }
  }
}));

type Props = {
  title?: string;
  address?: string;
};

const Page: React.FC<Props> = ({ children, address }) => {
  const classes = useStyles();

  return (
    <ThemeProvider theme={day}>
      <CssBaseline />
      <Container maxWidth="lg" component="header" sx={{
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
        mt: 6,
        position: "relative",
        zIndex: 2,
      }}>
        <Link to="/">
          <Box className={classes.logo}>
            <img src={logo} alt="Tabula Logo" />
          </Box>
        </Link>

        {address ? (
          <div className="publisher-link">
            <Link to={`/${address}`}>
              <p>{shortAddress(address)}</p>
            </Link>
          </div>
        ) : (
          <Button variant="contained">
            Connect Wallet
          </Button>
        )
        }
      </Container>
      <main>{children}</main>
    </ThemeProvider>
  );
};

export default Page;

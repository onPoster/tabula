import React from "react"
import { Box, Container, Typography, Button, Grid } from "@mui/material"
import { ExternalLink } from "../../commons/ExternalLink"
import theme, { typography, palette } from "../../../theme"
import Page from "../../layout/Page"
import gnosisLogo from "../../../assets/images/gnosis-logo.png"
import benefitBg from "../../../assets/images/benefit-bg.png"
import benefit1 from "../../../assets/images/benefit1.png"
import benefit2 from "../../../assets/images/benefit2.png"
import benefit3 from "../../../assets/images/benefit3.png"
import tabletHero from "../../../assets/images/tablet-hero-graphic.png"
import paperTextureNight from "../../../assets/images/paper-texture-800-night.jpg"
import { makeStyles } from "@mui/styles"
import { useNavigate } from "react-router-dom"

const benefits = [
  {
    image: benefit1,
    title: "Resilient Content",
    description:
      "Posts on Tabula are hosted on the distributed peer-to-peer IPFS network, ensuring censorship-resistance and no single point of failure.",
  },
  {
    image: benefit2,
    title: "Decentralized Ecosystem",
    description:
      "Tabula publications are created in a permissionless and trustless manner, without requiring support from an intermediary or governing body.",
  },
  {
    image: benefit3,
    title: "Unopinionated Ownership",
    description:
      "Any Ethereum account can own a Tabula publication, making it ideal for single accounts, DAOs, and other multisig-based organizations.",
  },
]

const gnosisLink = "https://gnosisguild.org"

const useStyles = makeStyles(() => ({
  benefitImage: {
    aspectRatio: "1/1",
    position: "absolute",
    width: "100%",
    "& img": {
      objectFit: "contain",
      objectPosition: "center",
      transform: "translateY(-10%)",
    },
  },
  footerLink: {
    transition: "opacity 0.25s ease-in-out",
    "&:hover": {
      opacity: 0.6,
    },
  },
  gnosisLogo: {
    width: 24,
  },
  gnosisLink: {
    color: palette.primary[1000],
    display: "inline !important",
    textDecoration: "underline !important",
  },
}))

export const LandingView: React.FC = () => {
  const classes = useStyles()
  const navigate = useNavigate()
  return (
    <Page>
      <Box
        component="section"
        sx={{
          alignItems: "center",
          backgroundImage: `url(${paperTextureNight})`,
          backgroundSize: 800,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100vh",
          position: "absolute",
          top: 0,
          width: "100%",
        }}
      >
        <Container maxWidth="lg" sx={{ zIndex: 2 }}>
          <Grid container>
            <Grid item xs={12} sm={6}>
              <Typography
                color="primary"
                component="div"
                fontFamily={typography.fontFamilies.sans}
                letterSpacing={4}
                textTransform="uppercase"
                variant="h5"
              >
                Create your
              </Typography>
              <Typography
                variant="h1"
                textTransform="uppercase"
                fontSize="6rem"
                color={palette.whites[1000]}
                sx={{ marginBlockStart: 0, mt: 1 }}
              >
                Tabula
              </Typography>
              <Typography variant="subtitle1" color={palette.whites[1000]}>
                Instant web3 publications for writers, DAOs, and any Ethereum-based account.
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button variant="contained" onClick={() => navigate("/wallet")}>
                  Get Started
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
        <Box
          sx={{
            overflowX: "hidden",
            height: "140vw",
            position: "absolute",
            transform: "translateY(80%)",
            width: "100vw",
            [`${theme.breakpoints.up("sm")}`]: {
              transform: "translateY(40%)",
              height: "70vw",
            },
            [`${theme.breakpoints.up("sm")} and (orientation:portrait)`]: {
              transform: "translateY(60%)",
              height: "90vw",
            },
            [`${theme.breakpoints.up("lg")}`]: {
              height: "50vw",
            },
          }}
        >
          <Box
            sx={{
              width: "140vw",
              right: "-20vw",
              position: "absolute",
              [`${theme.breakpoints.down("sm")}`]: {
                maxWidth: 600,
              },
              [`${theme.breakpoints.up("sm")}`]: {
                right: "-15vw",
                width: "70vw",
              },
              [`${theme.breakpoints.up("sm")} and (orientation:portrait)`]: {
                right: "-15vw",
                width: "90vw",
              },
              [`${theme.breakpoints.up("lg")}`]: {
                right: "-8vw",
                width: "50vw",
              },
            }}
          >
            <img src={tabletHero} alt="Tablet graphic" />
          </Box>
        </Box>
      </Box>
      <Box
        component="section"
        sx={{
          mt: "calc(100vh - 80px)",
          pt: 8,
          [theme.breakpoints.down("md")]: {
            mt: "100vh",
          },
          [theme.breakpoints.down("sm")]: {
            mt: "calc(100vh + 160px)",
          },
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" color="secondary" fontSize={{ xs: "3rem", lg: "4rem" }} textTransform="uppercase">
            Why Tabula?
          </Typography>
        </Container>
      </Box>
      <Box
        component="section"
        sx={{
          pt: 16,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={8}>
            {benefits.map((benefit) => (
              <Grid item xs={12} md={4} key={benefit.title}>
                <Box
                  sx={{
                    mb: 2,
                    position: "relative",
                    width: 192,
                  }}
                >
                  <Box className={classes.benefitImage}>
                    <img src={benefit.image} alt="" height="100%" />
                  </Box>
                  <img src={benefitBg} alt="" />
                </Box>
                <Typography component="h3" color="secondary" fontWeight={700} variant="h4">
                  {benefit.title}
                </Typography>
                <Typography color="secondary">{benefit.description}</Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <Box
        component="section"
        sx={{
          pt: 16,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              alignItems: "center",
              display: "inline-flex",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <ExternalLink className={classes.footerLink} link={gnosisLink}>
              <img src={gnosisLogo} alt="Gnosis Guild" className={classes.gnosisLogo} />
            </ExternalLink>
            <Typography fontSize={14} sx={{ ml: 1 }}>
              A product by
              {` `}
              <ExternalLink className={`${classes.gnosisLink} ${classes.footerLink}`} link={gnosisLink}>
                Gnosis Guild
              </ExternalLink>
            </Typography>
          </Box>
        </Container>
      </Box>
    </Page>
  )
}

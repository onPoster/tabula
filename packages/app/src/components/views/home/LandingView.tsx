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
import { useIPFSContext } from "../../../services/ipfs/context"

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

const MOCK =
  "<h1>A Revolutionary Motivational Tool for Developers</h1><p><strong>Introduction</strong></p><p>In today&#x27;s hyper-connected world, software performance is key. Yet, how do you ensure your developers are intrinsically motivated to deliver optimal performance? Introducing DevPill - the first-of-its-kind motivational tool designed to transform the way your developers approach their work.</p><p><strong>Product Overview</strong></p><p>DevPill is a groundbreaking tool that operates on a powerful yet simple premise: When your software crashes or runs slowly, your developers experience a slight discomfort. This immediate feedback mechanism provides developers a visceral connection to their work&#x27;s performance, igniting a deep-rooted motivation to deliver the best software solutions possible.</p><p><strong>Benefits</strong></p><ol type='1'><li><strong>Increased Performance:</strong> DevPill creates an immediate, tangible connection between a developers work and its outcome, resulting in increased focus on delivering high-performing, error-free software.</li><li><strong>Enhanced Motivation:</strong> Through DevPill, developers will strive for perfection, not just due to professional pride, but because their comfort is directly linked to the software&#x27;s performance.</li><li><strong>Team Accountability:</strong> DevPill fosters a culture of accountability and responsibility, ensuring every team member is dedicated to optimal software performance.</li><li><strong>Innovation &amp; Problem-Solving:</strong> With a keen desire to avoid discomfort, your developers will be more motivated than ever to troubleshoot and innovate, ensuring that problems are quickly resolved.</li></ol><p><strong>Safety &amp; Ethics</strong></p><p>DevPill is designed with a focus on safety and ethics. The discomfort triggered by software performance issues is mild and harmless, akin to a minor headache. Our product has been rigorously tested to ensure it complies with all health and safety standards.</p><p><strong>Conclusion</strong></p><p>In the competitive landscape of software development, every edge counts. DevPill provides a unique, revolutionary approach to enhancing developer motivation, accountability, and ultimately, software performance. Give your developers the tool they need to truly connect with their work. Choose DevPill.</p>"

export const LandingView: React.FC = () => {
  const classes = useStyles()
  const navigate = useNavigate()
  const { pinAction, encode } = useIPFSContext()
  const test = async () => {
    const textEnconded = await encode(MOCK)
    textEnconded && pinAction(textEnconded, "test-encoded")
    
    console.log("textEncoded", textEnconded)
  }
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
          overflowX: "clip",
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
                <Button variant="contained" onClick={() => test()}>
                  Get Started
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
        <Box
          sx={{
            overflow: "clip",
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

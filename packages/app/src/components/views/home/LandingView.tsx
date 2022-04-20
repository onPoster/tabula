import React from "react"
import { Box, Container, Typography, Button, Grid } from "@mui/material"
import { Link } from "react-router-dom"
import theme, { typography, palette } from "../../../theme"
import Page from "../../layout/Page"
import benefitBg from "../../../assets/images/benefit-bg.png"
import benefit1 from "../../../assets/images/benefit1.png"
import benefit2 from "../../../assets/images/benefit2.png"
import benefit3 from "../../../assets/images/benefit3.png"
import tabletHero from "../../../assets/images/tablet-hero-graphic.png"
import paperTextureNight from "../../../assets/images/paper-texture-800-night.jpg"
import { makeStyles } from "@mui/styles"
import { Publisher } from "../../../models/publisher"

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
}))

export const LandingView: React.FC = () => {
  const classes = useStyles()
  const publishers: Publisher[] = []

  return (
    <Page>
      <Box
        component="section"
        sx={{
          alignItems: "center",
          backgroundImage: `url(${paperTextureNight})`,
          backgroundSize: 800,
          display: "flex",
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
                <Button variant="contained">Get Started</Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
        <Box
          sx={{
            width: "140vw",
            right: "-20vw",
            bottom: 0,
            transform: "translateY(50%)",
            position: "absolute",
            [`${theme.breakpoints.up("sm")}`]: {
              right: "-15vw",
              transform: "translateY(40%)",
              width: "70vw",
            },
            [`${theme.breakpoints.up("sm")} and (orientation:portrait)`]: {
              right: "-15vw",
              transform: "translateY(30%)",
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
          <Grid container spacing={8} flexDirection="row-reverse">
            <Grid item xs={12} sm={5}>
              {/* <Box>
                <Typography variant="h4" component="h3" textTransform="uppercase" color="secondary">
                  Discover
                </Typography>
                Tags go here
              </Box>
              <Box sx={{ mt: 8 }}>
                <Typography variant="h4" component="h3" textTransform="uppercase" color="secondary">
                  Follow
                </Typography>
                <Box component="ul">
                  {publishers.map((publisher: Publisher, index) => (
                    <Box
                      component="li"
                      key={publisher.address}
                      sx={{
                        alignItems: "flex-start",
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 3,
                      }}
                    >
                      <Box>
                        <Link to={`/${publisher.address}`}>
                          <Box sx={{ alignItems: "content", display: "flex" }}>
                            <Box sx={{ borderRadius: 999, bgcolor: palette.grays[200], height: 24, mr: 1, width: 24 }}>
                              {publisher.image && (
                                <img src={publisher.image} alt={publisher.title && publisher.title} />
                              )}
                            </Box>
                            <Typography fontFamily={typography.fontFamilies.sans} color="textPrimary">
                              Gnosis Guild
                            </Typography>
                            <Typography
                              color="primary"
                              fontFamily={typography.fontFamilies.sans}
                              fontWeight={600}
                              lineHeight="2"
                              variant="body2"
                              sx={{ ml: 1, "&:hover": { textDecoration: "underline" } }}
                            >
                              posts
                            </Typography>
                          </Box>
                        </Link>
                        <Typography color={palette.grays[800]} variant="body2">
                          a keeper of the zodiac open standard for DAOs
                        </Typography>
                      </Box>
                      <Button size="small" variant="contained" sx={{ display: "inline-flex" }}>
                        Follow
                      </Button>
                    </Box>
                  ))}
                </Box>
              </Box> */}
            </Grid>
            <Grid item xs={12} sm={7}>
              <Typography variant="h4" component="h3" textTransform="uppercase" color="secondary">
                Showcase
              </Typography>
              {/* {posts &&
                posts.map((post: Post, index) => (
                  <PostPreview
                    key={post.id}
                    post={post}
                    address={post.publisher}
                    link={`/${post.publisher}`}
                    sx={{ mt: index > 0 ? 5 : 3 }}
                  />
                ))} */}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Page>
  )
}

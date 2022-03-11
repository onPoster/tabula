import React, { useEffect, useState } from "react"
import Page from "./components/layout/Page"
import { Box, Button, Container, Grid, Typography } from "@mui/material"
import { makeStyles } from "@mui/styles"
import theme, { palette, typography } from "./theme"
import paperTextureNight from "./assets/images/paper-texture-800-night.jpg"
import benefitBg from "./assets/images/benefit-bg.png"
import benefit1 from "./assets/images/benefit1.png"
import benefit2 from "./assets/images/benefit2.png"
import benefit3 from "./assets/images/benefit3.png"
import tabletHero from "./assets/images/tablet-hero-graphic.png"
import { Link } from "react-router-dom"
import { shortAddress } from "./utils/string"
import "./App.css"

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

interface Content {
  article: string
  authors: [string]
  postedOn: number
  tags: [string]
  title: string
  description: string
  publisher: string
  image: string
  id: string
}

interface Publisher {
  address: string
  image?: string
  posts: Array<Content>
  title?: string
}

function App() {
  const classes = useStyles()

  const [publishers, setPublishers] = useState<Array<Publisher>>([])
  const [posts, setPosts] = useState<Array<Content>>([])

  useEffect(() => {
    getPublishers()
  }, [])

  async function getPublishers() {
    const result = await fetch(`https://api.thegraph.com/subgraphs/name/onposter/tabula`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
        query {
          posts {
            id
            publisher
            title
            authors
            tags
            postedOn
            lastUpdated
          }
        }`,
      }),
    })

    const res = await result.json()
    const posts: Array<Content> = []
    const publishers: Array<Publisher> = []

    res.data.posts.forEach((post: Content) => {
      const index = publishers.findIndex((publisher) => publisher.address === post.publisher)
      if (index > -1) {
        publishers[index].posts.push(post)
      } else {
        publishers.push({ address: post.publisher, posts: [post] })
      }
    })

    setPosts(res.data.posts)
    setPublishers(publishers)
  }

  const benefits = [
    {
      image: benefit1,
      title: "Benefit #1",
      description:
        "Description for benefit #1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      image: benefit2,
      title: "Benefit #2",
      description:
        "Description for benefit #2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      image: benefit3,
      title: "Benefit #3",
      description:
        "Description for benefit #3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
  ]

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
          <Typography color="primary" component="div" letterSpacing={4} textTransform="uppercase" variant="h5">
            Introducing
          </Typography>
          <Typography variant="h1" textTransform="uppercase" color={palette.whites[1000]}>
            Tabula
          </Typography>
          <Typography variant="subtitle1" color={palette.whites[1000]}>
            Create and share together on web3.
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button variant="contained">Get Started</Button>
          </Box>
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
              width: "60vw",
            },
          }}
        >
          <img src={tabletHero} alt="Tablet graphic" />
        </Box>
      </Box>
      <Box
        component="section"
        sx={{
          mt: "100vh",
          pt: 12,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" color="secondary" textTransform="uppercase">
            Features &amp;
            <br />
            Benefits
          </Typography>
          <Typography color="secondary" variant="subtitle2">
            Features &amp; Benefits description goes here.
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
              <Box>
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
                              {/* {publisher.title ? publisher.title : shortAddress(publisher.address)} */}
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
                              {publisher.posts.length} posts
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
              </Box>
            </Grid>
            <Grid item xs={12} sm={7}>
              <Typography variant="h4" component="h3" textTransform="uppercase" color="secondary">
                Showcase
              </Typography>
              {posts.map((post: Content, index) => (
                <Box
                  key={post.id}
                  sx={{
                    mt: index > 0 ? 5 : 3,
                  }}
                >
                  <Link to={`/${post.publisher}`}>
                    <Box
                      sx={{
                        alignItems: "stretch",
                        borderRadius: 1,
                        color: "initial",
                        display: "flex",
                        transition: "background 0.25s ease-in-out",
                        "&:hover": {
                          bgcolor: palette.whites[600],
                          cursor: "pointer",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: palette.grays[100],
                          borderRadius: 1,
                          display: "flex",
                          overflow: "hidden",
                          width: 256,
                          "& img": {
                            height: "100%",
                            objectFit: "cover",
                          },
                        }}
                      >
                        {post.image && <img src={post.image} alt={post.title} />}
                      </Box>
                      <Box sx={{ ml: 3, py: 2, pr: 2 }}>
                        <Box sx={{ alignItems: "content", display: "flex", mb: 2 }}>
                          <Box
                            sx={{
                              borderRadius: 999,
                              bgcolor: palette.grays[200],
                              border: `1px solid ${palette.grays[200]}`,
                              height: 32,
                              mr: 1,
                              width: 32,
                            }}
                          >
                            {post.image && <img src={post.image} alt={post.title && post.title} />}
                          </Box>
                          <Typography
                            fontFamily={typography.fontFamilies.sans}
                            color={palette.grays[800]}
                            fontWeight={700}
                          >
                            {post.authors ? post.authors : "Gnosis Guild"}
                          </Typography>
                          <Box
                            sx={{
                              bgcolor: palette.secondary[200],
                              borderRadius: 1,
                              color: theme.palette.secondary.main,
                              display: "inline-flex",
                              ml: 1,
                              px: 1,
                            }}
                          >
                            {shortAddress(post.publisher)}
                          </Box>
                        </Box>
                        <Typography variant="h6" component="h3" fontWeight={700} lineHeight="1">
                          {post.title ? post.title : "Gossip of the Old World"}
                        </Typography>
                        <Typography color={palette.grays[800]} lineHeight="125%">
                          {post.description
                            ? post.description
                            : "Cooperatives, gaming guilds, and the networks to come"}
                        </Typography>
                        {post.description}
                        <Box
                          sx={{
                            alignItems: "center",
                            display: "flex",
                            mt: 2,
                          }}
                        >
                          {post.postedOn}
                          {post.tags && (
                            <Box component="ul" sx={{ ml: 2 }}>
                              {post.tags.map((tag, index) => (
                                <Box
                                  key={tag}
                                  component="li"
                                  sx={{
                                    bgcolor: palette.secondary[200],
                                    borderRadius: 1,
                                    color: theme.palette.secondary.main,
                                    display: "inline-flex",
                                    ml: index > 0 ? 1 : 0,
                                    px: 1,
                                  }}
                                >
                                  {tag}
                                </Box>
                              ))}
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Link>
                </Box>
              ))}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Page>
  )
}

export default App

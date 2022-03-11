import React, { useEffect, useState } from "react";
import Page from "./components/layout/Page";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { palette, typography } from "./theme";
import paperTextureNight from "./assets/images/paper-texture-800-night.jpg";
import benefitBg from "./assets/images/benefit-bg.png";
import benefit1 from "./assets/images/benefit1.png";
import benefit2 from "./assets/images/benefit2.png";
import benefit3 from "./assets/images/benefit3.png";
import tabletHero from "./assets/images/tablet-hero-graphic.png";
import { Link } from "react-router-dom";
import { shortAddress } from "./utils/string";
import "./App.css";

const useStyles = makeStyles(() => ({
  benefitImage: {
    aspectRatio: '1/1',
    position: 'absolute',
    width: '100%',
    '& img': {
      objectFit: 'contain',
      objectPosition: 'center',
      transform: 'translateY(-10%)'
    }
  }
}));

interface Content {
  article: string;
  authors: [string];
  tags: [string];
  title: string;
  description: string;
  publisher: string;
  image: string;
  id: string;
}

interface Publisher {
  address: string;
  posts: Array<Content>;
}

function App() {
  const classes = useStyles();

  const [publishers, setPublishers] = useState<Array<Publisher>>([]);

  useEffect(() => {
    getPublishers();
  }, []);

  async function getPublishers() {
    const result = await fetch(
      `https://api.thegraph.com/subgraphs/name/onposter/tabula`,
      {
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
      }
    );

    const res = await result.json();
    const publishers: Array<Publisher> = [];

    res.data.posts.forEach((post: Content) => {
      const index = publishers.findIndex(
        (publisher) => publisher.address === post.publisher
      );
      if (index > -1) {
        publishers[index].posts.push(post);
      } else {
        publishers.push({ address: post.publisher, posts: [post] });
      }
    });

    setPublishers(publishers);
  }

  const benefits = [
    {
      image: benefit1,
      title: 'Benefit #1',
      description: 'Description for benefit #1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      image: benefit2,
      title: 'Benefit #2',
      description: 'Description for benefit #2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      image: benefit3,
      title: 'Benefit #3',
      description: 'Description for benefit #3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    }
  ]

  return (
    <Page>
      <Box sx={{
        alignItems: 'center',
        backgroundImage: `url(${paperTextureNight})`,
        backgroundSize: 800,
        display: 'flex',
        justifyContent: 'center',
        height: "100vh",
        position: 'absolute',
        top: 0,
        width: '100%',
      }}>
        <Container maxWidth="lg" sx={{zIndex: 2}}>
          <Typography 
            color="primary" 
            component="div" 
            letterSpacing={4} 
            textTransform="uppercase" 
            variant="h5" 
          >
            Introducing
          </Typography>
          <Typography variant="h1" textTransform="uppercase" color={palette.whites[1000]}>
            Tabula
          </Typography>
          <Typography variant="subtitle1" color={palette.whites[1000]}>
            Create and share together on web3.
          </Typography>
          <Box sx={{mt: 4}}>
            <Button variant="contained">
              Get Started
            </Button>
          </Box>
        </Container>
        <Box sx={{
          width: '60vw',
          right: '-8vw',
          bottom: 0,
          transform: 'translateY(50%)',
          position: 'absolute',
        }}>
          <img src={tabletHero} alt="Tablet graphic" width="100%"/>
        </Box>
      </Box>
      <Box component="section" sx={{
        mt: '100vh',
        pt: 12,
      }}>
          <Container maxWidth="lg">
            <Typography variant="h2" color="secondary" textTransform="uppercase">
              Features &amp;
              <br/>
              Benefits
            </Typography>
            <Typography color="secondary" variant="subtitle2">
              Features &amp; Benefits description goes here.
            </Typography>
          </Container>
      </Box>
      <Box component="section" sx={{
        pt: 16,
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={8}>
            {benefits.map((benefit) => (
              <Grid item xs={12} md={4}>
                <Box sx={{
                  mb: 2,
                  position: 'relative',
                  width: 192,
                }}>
                  <Box className={classes.benefitImage}>
                    <img src={benefit.image} alt="" height="100%" width="100%" />
                  </Box>
                  <img src={benefitBg} alt="" width="100%" />
                </Box>
                <Typography
                  component="h3"
                  color="secondary"
                  fontWeight={700}
                  variant="h4"
                >
                  {benefit.title}
                </Typography>
                <Typography color="secondary">
                  {benefit.description}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <Box component="section" sx={{
        pt: 16,
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={8} flexDirection="row-reverse">
            <Grid item xs={12} sm={5}>
              <Box>
                <Typography
                  variant="h4"
                  component="h3"
                  textTransform="uppercase"
                  color="secondary"
                >
                  Discover
                </Typography>
                Tags go here
              </Box>
              <Box sx={{mt: 8}}>
                <Typography
                  variant="h4"
                  component="h3"
                  textTransform="uppercase"
                  color="secondary"
                >
                  Follow
                </Typography>
                {publishers.map((publisher: Publisher) => (
                  <li key={publisher.address}>
                    <Link to={`/${publisher.address}`}>
                      <div className="publisher-box">
                        <h3>{shortAddress(publisher.address)}</h3>

                        <p>{publisher.posts.length} posts</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} sm={7}>
              <Typography
                variant="h4"
                component="h3"
                textTransform="uppercase"
                color="secondary"
              >
                Showcase
              </Typography>
              {publishers.map((publisher: Publisher) => (
                <li key={publisher.address}>
                  <Link to={`/${publisher.address}`}>
                    <div className="publisher-box">
                      <h3>{shortAddress(publisher.address)}</h3>

                      <p>{publisher.posts.length} posts</p>
                    </div>
                  </Link>
                </li>
              ))}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Page>
  );
}

export default App;

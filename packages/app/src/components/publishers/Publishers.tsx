import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Box, Container, Typography } from "@mui/material"
import theme, { palette, typography } from "../../theme"
import Page from "../layout/Page"
import PostPreview from "../PostPreview"
import { shortAddress } from "../../utils/string"
import { Content } from "../../models/Content"

function App() {
  const [posts, setPosts] = useState([])
  const [address, setAddress] = useState(useParams().address)
  const [publishers, setPublishers] = useState([])

  useEffect(() => {
    if (address) {
      getPostsForAddress(address)
    }
  }, [])

  async function getPostsForAddress(address: String) {
    const result = await fetch(`https://api.thegraph.com/subgraphs/name/onposter/tabula`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
        query {
          posts(where:{publisher: "${address}"}) {
            id
            publisher
            article
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
    setPosts(res.data.posts)
  }

  return (
    <Page address={address}>
      <Container maxWidth="md">
        {posts.map((post: Content, index) => (
          <PostPreview
            key={post.id} 
            post={post}
            address={address}
            link={`/${address}/${post.id}`}
            sx={{mt: 5}}
          />
        ))}
      </Container>
    </Page>
  )
}

export default App

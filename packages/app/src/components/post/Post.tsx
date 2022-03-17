import { useEffect, useState } from "react"
import Page from "../layout/Page"
import Markdown from '../Markdown';
import { Container } from "@mui/material"
import { useParams } from "react-router-dom"

interface Content {
  article: string
  authors: [string]
  tags: [string]
  title: string
  description: string
  image: string
  id: string
}

function Post() {
  const [postId, setPostId] = useState(useParams().postId)
  const [post, setPost] = useState<Content>()
  const [address, setAddress] = useState(useParams().address)

  useEffect(() => {
    console.log("POST PAGE")
    if (postId) {
      getPost(postId)
    }
  }, [])

  async function getPost(postId: String) {
    const result = await fetch(`https://api.thegraph.com/subgraphs/name/onposter/tabula`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
        query {
          posts(where:{id: "${postId}"}) {
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
    setPost(res.data.posts[0])
  }

  return (
    <Page address={address}>
      <Container maxWidth="sm">
        {post && (
          <Markdown>
            {post.article}
          </Markdown>
        )}
      </Container>
    </Page>
  )
}

export default Post

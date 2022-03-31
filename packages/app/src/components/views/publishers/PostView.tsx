import React from "react"
import { Container } from "@mui/material"
import Markdown from "markdown-to-jsx"
import { useParams } from "react-router-dom"
import { usePost } from "../../../services/publisher/hooks/usePost"
import Page from "../../layout/Page"

export const PostView: React.FC = () => {
  const { postId } = useParams<{ postId: string }>()
  const { data: posts } = usePost(postId || "")
  const post = posts && posts[0]

  return (
    <Page>
      <Container maxWidth="sm">{post && <Markdown>{post.article}</Markdown>}</Container>
    </Page>
  )
}

/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Chip, CircularProgress, Grid, Typography } from "@mui/material"

import React, { Fragment, useEffect, useState } from "react"
import TurndownService from "turndown"
import { usePublicationContext } from "../../../services/publications/contexts"
import { palette } from "../../../theme"

import { Markdown } from "../../commons/Markdown"

import { ViewContainer } from "../../commons/ViewContainer"
import CreateArticlePage from "../../layout/CreateArticlePage"
import { useMarkdown } from "../../../hooks/useMarkdown"
import { toBase64 } from "../../../utils/string-handler"
import { useLocation } from "react-router-dom"

const turndownService = new TurndownService({ headingStyle: "atx" })
const PreviewArticleView: React.FC = () => {
  const location = useLocation()
  const { convertToHtml, loading } = useMarkdown()
  const { publication, draftArticle, articleContent, draftArticleThumbnail } = usePublicationContext()
  const [articleHtml, setArticleHtml] = useState<string>("")
  const [thumbnailUri, setThumbnailUri] = useState<string | undefined>(undefined)
  const article = turndownService.turndown(articleHtml)

  const isEdit = location.pathname.includes("edit") && "edit"
  const isNew = location.pathname.includes("new") && "new"

  useEffect(() => {
    const articleToHtmlFlow = async () => {
      if (articleContent?.length) {
        const content = await convertToHtml(articleContent, true)
        setArticleHtml(content)
      }
    }

    articleToHtmlFlow()
  }, [articleContent])

  useEffect(() => {
    const transformImg = async () => {
      if (draftArticleThumbnail) {
        const content = await toBase64(draftArticleThumbnail)
        setThumbnailUri(content)
      } else {
        setThumbnailUri(undefined)
      }
    }
    transformImg()
  }, [draftArticleThumbnail])

  return (
    <CreateArticlePage publication={publication} type={(isEdit || isNew) as "edit" | "new"}>
      <Box
        component="form"
        sx={{ position: "relative", overflowY: "auto", overflowX: "hidden", width: "100%", height: "100vh" }}
      >
        <ViewContainer maxWidth="sm">
          <Grid container mt={10} flexDirection="column">
            {thumbnailUri && <Box component="img" sx={{ borderRadius: 1 }} alt="thumbnail image" src={thumbnailUri} />}
            {draftArticle && (
              <Fragment>
                <Grid item>
                  <Typography variant="h1">
                    {draftArticle.title}
                  </Typography>
                </Grid>
                <Grid item>
                  <Grid container spacing={1} sx={{ marginLeft: -0.5 }}>
                    {draftArticle.tags &&
                      draftArticle.tags.length > 0 &&
                      draftArticle.tags.map((tag, index) => (
                        <Grid item key={index}>
                          <Chip sx={{ height: "100%" }} label={tag} size="small" />
                        </Grid>
                      ))}
                  </Grid>
                </Grid>
                <Grid item my={5} width="100%">
                  {loading && (
                    <Grid container gap={2} justifyContent="center" alignItems="center" my={2} direction="column">
                      <CircularProgress
                        color="primary"
                        size={50}
                        sx={{ marginRight: 1, color: palette.primary[1000] }}
                      />
                      <Typography>Decrypting data from IPFS...please wait a moment</Typography>
                    </Grid>
                  )}
                  {!loading && <Markdown>{article}</Markdown>}
                </Grid>
              </Fragment>
            )}
          </Grid>
        </ViewContainer>
      </Box>
    </CreateArticlePage>
  )
}

export default PreviewArticleView

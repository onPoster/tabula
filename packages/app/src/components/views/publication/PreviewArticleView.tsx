import { Box, Chip, Grid, Typography } from "@mui/material"
import Markdown from "markdown-to-jsx"
import React, { Fragment, useEffect, useState } from "react"
import TurndownService from "turndown"
import { usePublicationContext } from "../../../services/publications/contexts"
import { typography } from "../../../theme"
import { convertToHtml } from "../../../utils/markdown"

import { ViewContainer } from "../../commons/ViewContainer"
import CreateArticlePage from "../../layout/CreateArticlePage"

const turndownService = new TurndownService()
const PreviewArticleView: React.FC = () => {
  const [articleToShow, setArticleToShow] = useState<string>("")
  const { publication, draftArticle, articleContent } = usePublicationContext()

  useEffect(() => {
    if (articleContent?.length) {
      const content = convertToHtml(articleContent)
      const article = turndownService.turndown(content)
      setArticleToShow(article)
    }
  }, [articleContent])

  return (
    <CreateArticlePage publication={publication}>
      <Box
        component="form"
        sx={{ position: "relative", overflowY: "auto", overflowX: "hidden", width: "100%", height: "100vh" }}
      >
        <ViewContainer maxWidth="sm">
          <Grid container mt={10} flexDirection="column">
            {draftArticle && (
              <Fragment>
                <Grid item>
                  <Typography variant="h1" fontFamily={typography.fontFamilies.sans}>
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
                  <Markdown>{articleToShow}</Markdown>
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

/* eslint-disable react-hooks/exhaustive-deps */
import { Box, FormHelperText, Grid, InputLabel, Stack, TextField } from "@mui/material"

import React, { useEffect } from "react"
import { usePublicationContext } from "../../../services/publications/contexts"
import { ViewContainer } from "../../commons/ViewContainer"
import CreateArticlePage from "../../layout/CreateArticlePage"
import { ArticleContentSection } from "./components/ArticleContentSection"
import { useIpfs } from "../../../hooks/useIpfs"
import { palette } from "../../../theme"
import { checkTag } from "../../../utils/string-handler"

interface CreateArticleViewProps {
  type: "new" | "edit"
}

export const CreateArticleView: React.FC<CreateArticleViewProps> = ({ type }) => {
  const ipfs = useIpfs()
  const {
    publication,
    draftArticle,
    saveDraftArticle,
    article,
    setArticleContent,
    isEditing,
    articleContentError,
    articleTitleError,
  } = usePublicationContext()

  useEffect(() => {
    if (article && !isEditing) {
      const fetchCurrentArticle = async () => {
        const { image: thumbnailImg, article: articleContent } = article
        let img
        if (thumbnailImg) {
          img = await ipfs.getImgSrc(thumbnailImg)
        }
        const content = await ipfs.getText(articleContent)

        if (content) {
          const block = checkTag(content)

          if (block.length) {
            setArticleContent(block)
          }
        }
        saveDraftArticle({ ...article, image: img })
      }

      // call the function
      fetchCurrentArticle()
    }
  }, [article])

  return (
    <CreateArticlePage publication={publication} type={type}>
      <Box
        onSubmit={(e) => {
          e.preventDefault()
        }}
        component="form"
        sx={{ position: "relative", overflowY: "auto", overflowX: "hidden", width: "100%", height: "100vh" }}
      >
        <ViewContainer maxWidth="sm">
          <Grid container gap={4} flexDirection="column" my={12.5}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel>
                  title<span style={{ color: "#CA6303" }}>*</span>
                </InputLabel>
                <TextField
                  variant="standard"
                  value={draftArticle?.title}
                  onChange={(event) => draftArticle && saveDraftArticle({ ...draftArticle, title: event.target.value })}
                  InputProps={{ disableUnderline: true }}
                  sx={{ width: "100%", fontSize: 40 }}
                  placeholder="Post title"
                />

                {articleTitleError && (
                  <FormHelperText sx={{ color: palette.secondary[1000], textTransform: "capitalize" }}>
                    Title is required
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel>
                  Article content<span style={{ color: "#CA6303" }}>*</span>
                </InputLabel>
                <ArticleContentSection />
                {articleContentError && (
                  <FormHelperText sx={{ color: palette.secondary[1000], textTransform: "capitalize" }}>
                    Article content is required
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
          </Grid>
        </ViewContainer>
      </Box>
    </CreateArticlePage>
  )
}

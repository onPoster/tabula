/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Grid, InputLabel, Stack, TextField, Typography } from "@mui/material"

import React, { useEffect } from "react"
import { useArticleContext, usePublicationContext } from "../../../services/publications/contexts"
import { ViewContainer } from "../../commons/ViewContainer"
import CreateArticlePage from "../../layout/CreateArticlePage"
import { ArticleContentSection } from "./components/ArticleContentSection"
import { palette } from "../../../theme"
import useDebouncedState from "../../../hooks/useDebouncedState"

interface CreateArticleViewProps {
  type: "new" | "edit"
}

export const CreateArticleView: React.FC<CreateArticleViewProps> = React.memo(({ type }) => {
  const { publication } = usePublicationContext()
  const { draftArticle, updateDraftArticle } = useArticleContext()

  const [title, debouncedTitle, setTitle] = useDebouncedState<string>(draftArticle?.title ?? "")
  useEffect(() => {
    updateDraftArticle("title", debouncedTitle)
  }, [debouncedTitle])

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
                  title
                  <Typography component="span" sx={{ color: palette.primary[1000] }}>
                    *
                  </Typography>
                </InputLabel>
                <TextField
                  variant="standard"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  InputProps={{ disableUnderline: true }}
                  sx={{ width: "100%", fontSize: 40 }}
                  placeholder="Post title"
                />

                {/* {articleTitleError && (
                  <FormHelperText sx={{ color: palette.secondary[1000], textTransform: "capitalize" }}>
                    Title is required
                  </FormHelperText>
                )} */}
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel>
                  Article content
                  <Typography component="span" sx={{ color: palette.primary[1000] }}>
                    *
                  </Typography>
                </InputLabel>
                <ArticleContentSection />
                {/* {articleContentError && (
                  <FormHelperText sx={{ color: palette.secondary[1000], textTransform: "capitalize" }}>
                    Article content is required
                  </FormHelperText>
                )} */}
              </Stack>
            </Grid>
          </Grid>
        </ViewContainer>
      </Box>
    </CreateArticlePage>
  )
})

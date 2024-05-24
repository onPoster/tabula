import { Box, Container, FormHelperText, Grid, InputLabel, Stack, TextField, Typography } from "@mui/material"

import React, { useState } from "react"
import { useArticleContext, usePublicationContext } from "@/services/publications/contexts"
import { palette } from "@/theme"
import CreateArticlePage from "@/components/layout/CreateArticlePage"

import Editor from "@/components/commons/Editor/AdvanceEditor"
import { defaultValue } from "@/components/commons/Editor/default-value"
import { JSONContent } from "novel"
import { Controller } from "react-hook-form"

interface CreateArticleViewProps {
  type: "new" | "edit"
}

export const CreateArticleView: React.FC<CreateArticleViewProps> = React.memo(({ type }) => {
  const { publication } = usePublicationContext()
  const {
    // draftArticle,
    // updateDraftArticle,
    // articleTitleError,
    // articleContentError,
    setArticleHtml,
    articleFormMethods,
  } = useArticleContext()
  const [value, setValue] = useState<JSONContent>(defaultValue)

  const {
    control,
    setValue: saveArticleValue,
    formState: { errors },
  } = articleFormMethods

  const handleEditorChange = (htmlContent: string) => {
    if (htmlContent === "<p></p>") {
      saveArticleValue("article", "")
      setArticleHtml(undefined)
      return
    }
    if (htmlContent) {
      saveArticleValue("article", htmlContent)
      setArticleHtml(htmlContent)
    }
  }

  return (
    <CreateArticlePage publication={publication} type={type}>
      <Box
        onSubmit={(e) => {
          e.preventDefault()
        }}
        component="form"
        sx={{ position: "relative", overflowY: "auto", overflowX: "hidden", width: "100%", height: "100vh" }}
      >
        <Container maxWidth="md" sx={{ px: [8] }}>
          <Grid container gap={4} flexDirection="column" my={12.5}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel>
                  title
                  <Typography component="span" sx={{ color: palette.primary[1000] }}>
                    *
                  </Typography>
                </InputLabel>
                <Controller
                  control={control}
                  name="title"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      variant="standard"
                      fullWidth
                      InputProps={{ disableUnderline: true }}
                      sx={{ fontSize: 40 }}
                      placeholder="Post title"
                      error={!!errors.title}
                      helperText={errors.title?.message}
                    />
                  )}
                />
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
              </Stack>
              <Controller
                control={control}
                name="article"
                render={({ field }) => (
                  <Editor initialValue={value} {...field} onChange={setValue} onHtml={handleEditorChange} />
                )}
              />
              {errors.article && (
                <FormHelperText sx={{ color: "#d32f2f", textTransform: "capitalize" }}>
                  {errors.article.message}
                </FormHelperText>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </CreateArticlePage>
  )
})

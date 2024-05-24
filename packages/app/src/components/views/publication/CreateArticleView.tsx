import React, { useEffect, useState } from "react"
import CreateArticlePage from "@/components/layout/CreateArticlePage"
import Editor from "@/components/commons/Editor/AdvanceEditor"
import { Box, Container, FormHelperText, Grid, InputLabel, Stack, TextField, Typography } from "@mui/material"
import { useArticleContext, usePublicationContext } from "@/services/publications/contexts"
import { palette } from "@/theme"
import { defaultValue } from "@/components/commons/Editor/default-value"
import { JSONContent } from "novel"
import { Controller } from "react-hook-form"
import { generateJSON } from "@tiptap/html"
import useExtensions from "@/components/commons/Editor/extensions"

interface CreateArticleViewProps {
  type: "new" | "edit"
}

export const CreateArticleView: React.FC<CreateArticleViewProps> = React.memo(({ type }) => {
  const { publication } = usePublicationContext()
  const { setArticleHtml, articleFormMethods } = useArticleContext()
  const [value, setValue] = useState<JSONContent | undefined>(undefined)
  const extensions = useExtensions()
  const {
    control,
    getValues,
    setValue: saveArticleValue,
    formState: { errors },
  } = articleFormMethods

  const defaultArticleHtml = getValues("article")

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

  useEffect(() => {
    if (!value) {
      if (defaultArticleHtml) {
        return setValue(generateJSON(defaultArticleHtml, extensions))
      }
      setValue(defaultValue)
    }
  }, [defaultArticleHtml, extensions, value])

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
              {value && (
                <Controller
                  control={control}
                  name="article"
                  render={({ field }) => (
                    <Editor initialValue={value} {...field} onChange={setValue} onHtml={handleEditorChange} />
                  )}
                />
              )}
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

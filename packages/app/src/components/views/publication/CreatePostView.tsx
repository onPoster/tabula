import { Button, FormHelperText, Grid, TextField } from "@mui/material"
import React from "react"
import { Controller, useForm } from "react-hook-form"
import { usePublicationContext } from "../../../services/publications/contexts"
import { palette } from "../../../theme"
import { ViewContainer } from "../../commons/ViewContainer"
import PublicationPage from "../../layout/PublicationPage"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { Article } from "../../../models/publication"
import { useNavigate } from "react-router-dom"

const articleSchema = yup.object().shape({
  title: yup.string().required(),
  article: yup.string().required(),
})

export const CreatePostView: React.FC = () => {
  const navigate = useNavigate()
  const { publication, draftArticle, saveDraftArticle } = usePublicationContext()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(articleSchema),
    defaultValues: draftArticle,
  })

  const onSubmitHandler = (data: Article) => {
    saveDraftArticle(data)
    navigate("/publication/preview-post")
  }
  

  return (
    <PublicationPage publication={publication} showCreatePost={false}>
      <form onSubmit={handleSubmit((data) => onSubmitHandler(data as Article))}>
        <ViewContainer maxWidth="sm">
          <Grid container gap={4} flexDirection="column" mt={12.5}>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="title"
                render={({ field }) => <TextField {...field} placeholder="Your Title" sx={{ width: "100%" }} />}
                rules={{ required: true }}
              />
              {errors && errors.title && (
                <FormHelperText sx={{ color: palette.secondary[1000], textTransform: "capitalize" }}>
                  {errors.title.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="article"
                render={({ field }) => (
                  <TextField {...field} placeholder="Start your post..." sx={{ width: "100%" }} multiline rows={14} />
                )}
                rules={{ required: true }}
              />

              {errors && errors.article && (
                <FormHelperText sx={{ color: palette.secondary[1000], textTransform: "capitalize" }}>
                  {errors.article.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12} mt={1}>
              <Button variant="outlined" size="large" type="submit">
                Publish
              </Button>
            </Grid>
          </Grid>
        </ViewContainer>
      </form>
    </PublicationPage>
  )
}

import { Box, Button, CircularProgress, FormHelperText, Grid, styled, TextField, Typography } from "@mui/material"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import React, { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { usePublicationContext } from "../../../services/publications/contexts"
import { palette } from "../../../theme"
import { ViewContainer } from "../../commons/ViewContainer"
import PublicationPage from "../../layout/PublicationPage"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { Article } from "../../../models/publication"
import { useNavigate, useParams } from "react-router-dom"
import { useWeb3React } from "@web3-react/core"
import { haveActionPermission } from "../../../utils/permission"
import usePoster from "../../../services/poster/hooks/usePoster"
import usePublication from "../../../services/publications/hooks/usePublication"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import isIPFS from "is-ipfs"

const articleSchema = yup.object().shape({
  title: yup.string().required(),
  article: yup.string().required(),
})

const DeletePostButton = styled(Button)({
  border: `2px solid ${palette.grays[400]}`,
  background: palette.whites[400],
  color: palette.grays[800],
  "&:hover": {
    background: palette.whites[1000],
  },
})

export const CreatePostView: React.FC = () => {
  const navigate = useNavigate()
  const { account } = useWeb3React()
  const { deleteArticle } = usePoster()
  const { publication, article, draftArticle, getPinnedData, markdownArticle, saveDraftArticle, saveArticle } =
    usePublicationContext()
  const { indexing, setExecutePollInterval, transactionCompleted, setCurrentArticleId } = usePublication(
    publication?.id || "",
  )
  const { type } = useParams<{ type: "new" | "edit" }>()
  const [loading, setLoading] = useState<boolean>(false)
  const permissions = article && article.publication && article.publication.permissions
  const havePermissionToDelete = haveActionPermission(permissions || [], "articleDelete", account || "")
  const havePermissionToUpdate = haveActionPermission(permissions || [], "articleUpdate", account || "")
  const isValidHash = article && isIPFS.multihash(article.article)

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(articleSchema),
    defaultValues: draftArticle,
  })

  useEffect(() => {
    if (type === "edit" && isValidHash && article && !draftArticle) {
      const { title } = article
      setValue("title", title)
      if (!markdownArticle) {
        getPinnedData(article.article)
      }
      if (markdownArticle) {
        setValue("article", markdownArticle)
      }
    }
    if (type === "edit" && !isValidHash && article && !draftArticle) {
      const { title, article: articleDescription } = article
      setValue("title", title)
      setValue("article", articleDescription)
    }
  }, [type, article, setValue, isValidHash, markdownArticle, getPinnedData, draftArticle])

  useEffect(() => {
    if (transactionCompleted) {
      saveDraftArticle(undefined)
      navigate(-1)
    }
  }, [navigate, saveDraftArticle, transactionCompleted])

  const onSubmitHandler = (data: Article) => {
    saveDraftArticle(data)
    navigate(`/publication/${publication?.id}/preview-post/${type}`)
  }

  const handleDeleteArticle = async () => {
    if (article && article.id && havePermissionToDelete) {
      setLoading(true)
      setCurrentArticleId(article.id)
      await deleteArticle({
        action: "article/delete",
        id: article.id,
      }).then((res) => {
        setExecutePollInterval(true)
        if (res && res.error) {
          setExecutePollInterval(false)
          setLoading(false)
        }
      })
    }
  }

  const goToPublication = () => {
    saveDraftArticle(undefined)
    saveArticle(undefined)
    navigate(-1)
  }

  return (
    <PublicationPage publication={publication} showCreatePost={false}>
      <form onSubmit={handleSubmit((data) => onSubmitHandler(data as Article))}>
        <ViewContainer maxWidth="sm">
          <Grid container gap={4} flexDirection="column" mt={12.5}>
            <Grid item>
              <Box
                gap={2}
                sx={{
                  alignItems: "center",
                  cursor: "pointer",
                  display: "inline-flex",
                  transition: "opacity 0.25s ease-in-out",
                  "&:hover": {
                    opacity: 0.6,
                  },
                }}
                onClick={goToPublication}
              >
                <ArrowBackIcon color="secondary" />
                <Typography color="secondary" variant="subtitle2" sx={{ textDecoration: "underline" }}>
                  Back to Publication
                </Typography>
              </Box>
            </Grid>
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
            {type === "new" && (
              <Grid item xs={12} mt={1}>
                <Grid container justifyContent={"space-between"}>
                  <Button variant="outlined" size="large" onClick={goToPublication}>
                    Cancel
                  </Button>
                  <Button variant="contained" size="large" type="submit">
                    Publish
                  </Button>
                </Grid>
              </Grid>
            )}
            {type === "edit" && (
              <Grid item xs={12} mt={1}>
                <Grid container justifyContent={"space-between"}>
                  {havePermissionToDelete && (
                    <DeletePostButton
                      variant="contained"
                      size="large"
                      onClick={handleDeleteArticle}
                      disabled={loading || indexing}
                      startIcon={<DeleteOutlineIcon />}
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      {loading && <CircularProgress size={20} sx={{ marginRight: 1 }} />}
                      {indexing ? "Indexing..." : "Delete Post"}
                    </DeletePostButton>
                  )}
                  {havePermissionToUpdate && (
                    <Button variant="contained" size="large" type="submit" disabled={loading || indexing}>
                      Update Post
                    </Button>
                  )}
                </Grid>
              </Grid>
            )}
          </Grid>
        </ViewContainer>
      </form>
    </PublicationPage>
  )
}

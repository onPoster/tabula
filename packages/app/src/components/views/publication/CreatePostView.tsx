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
import { find } from "lodash"
import isIPFS from "is-ipfs"
import { usePosterContext } from "../../../services/poster/context"
import { useNotification } from "../../../hooks/useNotification"

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
  const openNotification = useNotification()
  const { account } = useWeb3React()
  const { deleteArticle } = usePoster()
  const { isIndexingDeleteArticle, setIsIndexingDeleteArticle, transactionUrl } = usePosterContext()
  const { publication, article, draftArticle, getPinnedData, markdownArticle, saveDraftArticle, savePublication } =
    usePublicationContext()
  const { data: publicationRefetch, refetch } = usePublication(publication?.id || "")
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

  //Execute poll interval to know the latest permission indexed
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        refetch()
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [refetch, loading])

  //Check is the transaction is already indexed
  useEffect(() => {
    if (loading && publicationRefetch?.articles && article) {
      const articleDeleted = find(publicationRefetch.articles, { id: article.id })
      if (!articleDeleted) {
        setLoading(false)
        setIsIndexingDeleteArticle(false)
        savePublication(publicationRefetch)
        openNotification({
          message: "Execute transaction confirmed!",
          autoHideDuration: 5000,
          variant: "success",
          detailsLink: transactionUrl,
        })
        navigate(-1)
      }
    }
  }, [
    article,
    loading,
    navigate,
    openNotification,
    publicationRefetch,
    savePublication,
    setIsIndexingDeleteArticle,
    transactionUrl,
  ])

  const onSubmitHandler = (data: Article) => {
    saveDraftArticle(data)
    setIsIndexingDeleteArticle(false)
    navigate(`/publication/preview-post/${type}`)
  }

  const handleDeleteArticle = async () => {
    if (article && article.id && havePermissionToDelete) {
      setLoading(true)
      await deleteArticle({
        action: "article/delete",
        id: article.id,
      }).then((res) => {
        if (res && res.error) {
          setLoading(false)
          setIsIndexingDeleteArticle(false)
        }
      })
    }
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
                onClick={() => navigate(-1)}
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
                  <Button variant="outlined" size="large" onClick={() => navigate(-1)}>
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
                      disabled={loading || isIndexingDeleteArticle}
                      startIcon={<DeleteOutlineIcon />}
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      {loading && <CircularProgress size={20} sx={{ marginRight: 1 }} />}
                      {isIndexingDeleteArticle ? "Indexing..." : "Delete Post"}
                    </DeletePostButton>
                  )}
                  {havePermissionToUpdate && (
                    <Button variant="contained" size="large" type="submit">
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

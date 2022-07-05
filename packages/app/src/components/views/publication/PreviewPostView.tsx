import React, { useEffect, useState } from "react"
import { Box, Button, CircularProgress, Grid, TextField, Typography } from "@mui/material"
import { usePublicationContext } from "../../../services/publications/contexts"
import { palette, typography } from "../../../theme"
import { ViewContainer } from "../../commons/ViewContainer"
import PublicationPage from "../../layout/PublicationPage"
import { useNavigate, useParams } from "react-router-dom"
import { UploadFile } from "../../commons/UploadFile"
import { Controller, useForm } from "react-hook-form"
import { useFiles } from "../../../hooks/useFiles"
import usePoster from "../../../services/poster/hooks/usePoster"
import { useWeb3React } from "@web3-react/core"
import useArticles from "../../../services/publications/hooks/useArticles"
import { haveActionPermission } from "../../../utils/permission"
import useLocalStorage from "../../../hooks/useLocalStorage"
import { Pinning } from "../../../models/pinning"
import { PinningAlert } from "../../commons/PinningAlert"
import { CreatableSelect } from "../../commons/CreatableSelect"
import { CreateSelectOption } from "../../../models/dropdown"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"

export const PreviewPostView: React.FC = () => {
  const navigate = useNavigate()

  const { account } = useWeb3React()
  const { type } = useParams<{ type: "new" | "edit" }>()
  const { publication, article, draftArticle, saveDraftArticle } = usePublicationContext()
  const [pinning] = useLocalStorage<Pinning | undefined>("pinning", undefined)
  const [tags, setTags] = useState<string[]>([])
  const [authors, setAuthors] = useState<string[]>([])
  const [articleImg, setArticleImg] = useState<File | undefined>(undefined)
  const { control, handleSubmit, setValue } = useForm({ defaultValues: { description: "" } })
  const { uploadFile, ipfs } = useFiles()
  const { createArticle, updateArticle } = usePoster()
  const {
    indexing: createArticleIndexing,
    setExecutePollInterval: createPoll,
    transactionCompleted: newArticleTransaction,
    newArticleId,
  } = useArticles()
  const {
    indexing: updateArticleIndexing,
    setExecutePollInterval: updatePoll,
    transactionCompleted: updateTransaction,
    newArticleId: updateArticleId,
    setArticleId,
    setCurrentTimestamp,
  } = useArticles()
  const [loading, setLoading] = useState<boolean>(false)
  const permissions = article && article.publication && article.publication.permissions
  const havePermissionToUpdate = haveActionPermission(permissions || [], "articleUpdate", account || "")

  const onSubmitHandler = (data: { description: string }) => {
    handleArticleAction(data)
  }

  const handleArticleAction = async (data: { description: string }) => {
    if (publication && draftArticle && account) {
      const { description } = data
      const { id } = publication
      const { title, article: draftArticleText } = draftArticle
      let image
      let hashArticle
      let imageUrl
      if (ipfs && articleImg) {
        image = await uploadFile(articleImg)
        if (image.path) {
          imageUrl = image.path
        }
      }

      if (!articleImg && type === "edit") {
        imageUrl = undefined
      }

      if (pinning && draftArticleText) {
        hashArticle = await uploadFile(draftArticleText)
      }

      if (title && authors.length) {
        setLoading(true)
        if (type === "new") {
          await createArticle(
            {
              action: "article/create",
              publicationId: id,
              title,
              article: hashArticle ? hashArticle.path : draftArticleText,
              description,
              tags,
              image: image?.path,
              authors,
            },
            hashArticle ? true : false,
          ).then((res) => {
            if (res?.error) {
              setLoading(false)
            } else {
              createPoll(true)
            }
          })
        }
        if (type === "edit" && havePermissionToUpdate && article?.id) {
          await updateArticle(
            {
              action: "article/update",
              id: article.id,
              title,
              article: hashArticle ? hashArticle.path : draftArticleText,
              description,
              tags,
              image: imageUrl,
              authors,
            },
            hashArticle ? true : false,
          ).then((res) => {
            if (article && article.lastUpdated) {
              setArticleId(article.id)
              setCurrentTimestamp(parseInt(article.lastUpdated))
              updatePoll(true)
            }

            if (res && res.error) {
              setLoading(false)
            } else if (article && article.lastUpdated) {
              setArticleId(article.id)
              setCurrentTimestamp(parseInt(article.lastUpdated))
              updatePoll(true)
            }
          })
        }
      }
    }
  }

  const handleTags = (items: CreateSelectOption[]) => {
    if (items.length) {
      const newTags = items.map((item) => item.value)
      setTags(newTags)
    } else {
      setTags([])
    }
  }

  const handleAuthors = (items: CreateSelectOption[]) => {
    if (items.length) {
      const newTags = items.map((item) => item.value)
      setAuthors(newTags)
    }
  }

  useEffect(() => {
    if (!authors.length && account && type === "new") {
      setAuthors([account])
    }
  }, [account, authors, type])

  useEffect(() => {
    if (!authors.length && article && article.authors?.length) {
      setAuthors(article.authors)
    }
  }, [account, authors, article])

  useEffect(() => {
    if (article && type === "edit") {
      setTags(article.tags ?? [])
      setValue("description", article.description ?? "")
    }
  }, [article, setValue, type])

  useEffect(() => {
    if ((newArticleTransaction || updateTransaction) && publication) {
      navigate(`/publication/${publication.id}/article/${newArticleId || updateArticleId}`)
    }
  }, [navigate, newArticleId, newArticleTransaction, publication, updateArticleId, updateTransaction])

  const generateButtonLabel = (): string => {
    if (createArticleIndexing) {
      return "Indexing..."
    }
    if (updateArticleIndexing) {
      return "Indexing..."
    }
    if (type === "new") {
      return "Publish now"
    }
    return "Publish update now"
  }

  const goToPost = () => navigate(-1)

  const goToPublication = () => {
    saveDraftArticle(undefined)
    navigate(-2)
  }

  return (
    <PublicationPage publication={publication} showCreatePost={false}>
      <ViewContainer maxWidth="sm">
        <form onSubmit={handleSubmit((data) => onSubmitHandler(data as { description: string }))}>
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
                onClick={goToPost}
              >
                <ArrowBackIcon color="secondary" />
                <Typography color="secondary" variant="subtitle2" sx={{ textDecoration: "underline" }}>
                  Back to Edit Post
                </Typography>
              </Box>
            </Grid>
            <Grid item>
              <UploadFile defaultImage={article?.image} onFileSelected={setArticleImg} />
            </Grid>
            <Grid item>
              <Typography
                color={palette.grays[1000]}
                variant="h6"
                fontSize={18}
                fontFamily={typography.fontFamilies.sans}
                sx={{ mb: 1, mt: 0 }}
              >
                Author(s):
              </Typography>
              <CreatableSelect placeholder="Add an author..." onSelected={handleAuthors} value={authors} />
            </Grid>
            <Grid item>
              <Typography
                color={palette.grays[1000]}
                variant="h6"
                fontSize={18}
                fontFamily={typography.fontFamilies.sans}
                sx={{ mb: 1, mt: 0 }}
              >
                Description
              </Typography>
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="Write a brief description..."
                    sx={{ width: "100%" }}
                    multiline
                    rows={4}
                  />
                )}
              />
            </Grid>
            <Grid item>
              <Typography
                color={palette.grays[1000]}
                variant="h6"
                fontSize={18}
                fontFamily={typography.fontFamilies.sans}
                sx={{ mb: 1, mt: 0 }}
              >
                Add up to 5 tags so your readers know what this post is about:
              </Typography>
              <CreatableSelect
                placeholder="Add up to 5 tags for your article..."
                onSelected={handleTags}
                value={tags}
                errorMsg={tags.length && tags.length >= 6 ? "Add up to 5 tags for your article" : undefined}
              />
            </Grid>

            {!pinning && (
              <Grid item>
                <PinningAlert />
              </Grid>
            )}

            <Grid item xs={12}>
              <Grid container justifyContent={"space-between"}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={goToPublication}
                  disabled={loading || updateArticleIndexing || createArticleIndexing}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  type="submit"
                  disabled={loading || updateArticleIndexing || createArticleIndexing}
                >
                  {loading && <CircularProgress size={20} sx={{ marginRight: 1 }} />}
                  {generateButtonLabel()}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </ViewContainer>
    </PublicationPage>
  )
}

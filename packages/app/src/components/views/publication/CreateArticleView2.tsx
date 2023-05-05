import React, { useEffect, useState } from "react"
import { Box, Button, CircularProgress, Stack, TextField, Typography } from "@mui/material"
import { useArticleContext, usePublicationContext } from "../../../services/publications/contexts"
import { palette, typography } from "../../../theme"
import { ViewContainer } from "../../commons/ViewContainer"
import PublicationPage from "../../layout/PublicationPage"
import { useNavigate, useParams } from "react-router-dom"
import { UploadFile } from "../../commons/UploadFile"
import { Controller, useForm } from "react-hook-form"
import { useIpfs } from "../../../hooks/useIpfs"
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
import usePublication from "../../../services/publications/hooks/usePublication"
import useArticle from "../../../services/publications/hooks/useArticle"

interface CreateArticleViewProps {
  type: "new" | "edit"
}

export const CreateArticleView2: React.FC<CreateArticleViewProps> = ({ type }) => {
  const navigate = useNavigate()
  const { publicationSlug } = useParams<{ publicationSlug: string }>()

  const { account } = useWeb3React()
  const { publication: publicationFromContext } = usePublicationContext()
  const { article, draftArticle, saveDraftArticle } = useArticleContext()
  const publication = usePublication(publicationSlug || "")
  const [pinning] = useLocalStorage<Pinning | undefined>("pinning", undefined)
  const [tags, setTags] = useState<string[]>([])
  const [authors, setAuthors] = useState<string[]>([])
  const [articleImg, setArticleImg] = useState<File | undefined>(undefined)
  const { control, handleSubmit, setValue } = useForm({ defaultValues: { description: "" } })
  const ipfs = useIpfs()
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
  } = useArticle(article?.id ?? "")
  const [loading, setLoading] = useState<boolean>(false)
  const permissions = article && article.publication && article.publication.permissions
  const havePermissionToUpdate = haveActionPermission(permissions || [], "articleUpdate", account || "")

  const onSubmitHandler = (data: { description: string }) => {
    handleArticleAction(data)
  }

  const handleArticleAction = async (data: { description: string }) => {
    if (publication && draftArticle && account) {
      const { description } = data
      const id = publication.publicationId
      if (id == null) {
        throw new Error("Publication id is null")
      }
      const { title, article: draftArticleText } = draftArticle
      let image
      let hashArticle
      let imageUrl
      if (articleImg) {
        image = await ipfs.uploadContent(articleImg)
        if (image.path) {
          imageUrl = image.path
        }
      }

      if (!articleImg && type === "edit") {
        imageUrl = undefined
      }

      if (pinning && draftArticleText) {
        hashArticle = await ipfs.uploadContent(draftArticleText)
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
    if ((newArticleTransaction || updateTransaction) && publicationSlug) {
      navigate(`/${publicationSlug}/${newArticleId || updateArticleId}`)
    }
  }, [navigate, newArticleId, newArticleTransaction, publicationSlug, updateArticleId, updateTransaction])

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
    <PublicationPage publication={publicationFromContext} showCreatePost={false}>
      <ViewContainer maxWidth="sm">
        <form onSubmit={handleSubmit((data) => onSubmitHandler(data as { description: string }))}>
          <Stack spacing={4} mt={12.5}>
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
                Back to Edit Article
              </Typography>
            </Box>
            <UploadFile defaultImage={article?.image} onFileSelected={setArticleImg} />
            <Stack spacing={0}>
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
            </Stack>
            <Stack spacing={0}>
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
            </Stack>
            <Stack spacing={0}>
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
            </Stack>
            {!pinning && <PinningAlert />}
            <Stack direction="row" justifyContent={"space-between"} spacing={2}>
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
            </Stack>
          </Stack>
        </form>
      </ViewContainer>
    </PublicationPage>
  )
}

import React, { useEffect, useState } from "react"
import { Box, Button, Chip, CircularProgress, Grid, TextField, Typography } from "@mui/material"
import { usePublicationContext } from "../../../services/publications/contexts"
import { palette, typography } from "../../../theme"
import { ViewContainer } from "../../commons/ViewContainer"
import PublicationPage from "../../layout/PublicationPage"

import { useNavigate, useParams } from "react-router-dom"
import { UploadFile } from "../../commons/UploadFile"
import { Controller, useForm } from "react-hook-form"
import { maxBy, remove } from "lodash"
import { useFiles } from "../../../hooks/useFiles"
import usePoster from "../../../services/poster/hooks/usePoster"
import { useWeb3React } from "@web3-react/core"
import useArticles from "../../../services/publications/hooks/useArticles"
import { haveActionPermission } from "../../../utils/permission"
import useLocalStorage from "../../../hooks/useLocalStorage"
import { Pinning } from "../../../models/pinning"
import { PinningAlert } from "../../commons/PinningAlert"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"

export const PreviewPostView: React.FC = () => {
  const navigate = useNavigate()
  const { account } = useWeb3React()
  const { type } = useParams<{ type: "new" | "edit" }>()
  const { publication, article, draftArticle, saveArticle, setMarkdownArticle } = usePublicationContext()
  const [pinning] = useLocalStorage<Pinning | undefined>("pinning", undefined)
  const [tag, setTag] = useState<string>("")
  const [tags, setTags] = useState<string[]>([])

  const [articleImg, setArticleImg] = useState<File>()
  const { control, handleSubmit, setValue } = useForm({ defaultValues: { description: "" } })
  const { uploadFile, ipfs } = useFiles()
  const { createArticle, updateArticle } = usePoster()
  const { data, executeQuery, refetch } = useArticles()
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
      if (ipfs && articleImg) {
        image = await uploadFile(articleImg)
      }
      if (pinning && draftArticleText) {
        hashArticle = await uploadFile(draftArticleText)
      }

      if (title) {
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
              authors: [account],
            },
            hashArticle ? true : false,
          ).then((res) => {
            if (res && res.error) setLoading(false)
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
              image: image ? image?.path : article.image,
              authors: [account],
            },
            hashArticle ? true : false,
          ).then((res) => {
            if (res && res.error) setLoading(false)
          })
        }
      }
    }
  }

  const handleTagKeyEvent = (ev: React.KeyboardEvent<HTMLDivElement>) => {
    if (ev.key === "Enter") {
      const currentTags = [...tags]
      currentTags.push(tag)
      setTags(currentTags)
      setTag("")
      ev.preventDefault()
    }
  }

  const handleDeleteTag = (index: number) => {
    const currentTags = [...tags]
    remove(currentTags, (tag: string) => {
      return tag === currentTags[index]
    })
    setTags(currentTags)
  }

  useEffect(() => {
    if (article && type === "edit") {
      setTags(article.tags ?? [])
      setValue("description", article.description ?? "")
    }
  }, [article, setValue, type])

  //Execute method to bring all articles
  useEffect(() => {
    if (!data) {
      executeQuery()
    }
  }, [data, executeQuery])

  //Execute poll interval to know the latest publications indexed
  useEffect(() => {
    if (draftArticle && draftArticle.title !== "" && loading) {
      const interval = setInterval(() => {
        refetch()
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [refetch, draftArticle, loading])

  //Method to know recent article created
  useEffect(() => {
    if (data && data.length && loading && draftArticle && draftArticle.title !== "") {
      const recentArticle = maxBy(data, (fetchedArticle) => {
        if (fetchedArticle.lastUpdated) {
          return parseInt(fetchedArticle.lastUpdated)
        }
      })
      if (recentArticle && recentArticle.title === draftArticle.title) {
        if (type === "new") {
          saveArticle(recentArticle)
          navigate(`/publication/${recentArticle.publication?.id}/article/${recentArticle.id}`)
          setLoading(false)
          return
        }
        if (
          type === "edit" &&
          recentArticle.lastUpdated &&
          article &&
          article.lastUpdated &&
          parseInt(recentArticle.lastUpdated) > parseInt(article.lastUpdated)
        ) {
          setMarkdownArticle(draftArticle.article)
          saveArticle(recentArticle)
          navigate(`/publication/${recentArticle.publication?.id}/article/${recentArticle.id}`)
          setLoading(false)
          return
        }
      }
    }
  }, [loading, navigate, data, draftArticle, saveArticle, type, article, setMarkdownArticle])

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
                  }
                }}
                onClick={() => navigate(-1)}
              >
                <ArrowBackIcon color="secondary" />
                <Typography color="secondary" variant="subtitle2" sx={{textDecoration: "underline"}}>
                  Back to Publication
                </Typography>
              </Box>
            </Grid>
            <Grid item>
              <UploadFile defaultImage={article?.image} onFileSelected={setArticleImg} />
            </Grid>
            <Grid item>
              <Typography
                color={palette.grays[800]}
                variant="h5"
                fontFamily={typography.fontFamilies.sans}
                sx={{ mb: 1, mt: 0 }}
              >
                {publication?.title}
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
                variant="body1"
                fontFamily={typography.fontFamilies.sans}
                sx={{ margin: 0 }}
              >
                Add up to 5 tags so your readers know what this post is about:
              </Typography>
              <TextField
                value={tag}
                onChange={({ target }) => setTag(target.value)}
                sx={{ width: "100%" }}
                placeholder="Add a tag..."
                onKeyPress={handleTagKeyEvent}
              />
              <Grid container gap={1} mt={1}>
                {tags.map((name, index) => (
                  <Chip label={name} size="small" key={index} onDelete={() => handleDeleteTag(index)} />
                ))}
              </Grid>
            </Grid>

            {!pinning && (
              <Grid item>
                <PinningAlert />
              </Grid>
            )}
            <Grid item xs={12}>
              <Grid container justifyContent={"space-between"}>
                <Button variant="outlined" size="large" onClick={() => navigate(-2)}>
                  Cancel
                </Button>
                <Button variant="contained" size="large" type="submit" disabled={loading}>
                  {loading && <CircularProgress size={20} sx={{ marginRight: 1 }} />}
                  {type === "new" ? "Publish now" : "Publish update now"}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </ViewContainer>
    </PublicationPage>
  )
}

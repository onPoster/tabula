import React, { useEffect, useState } from "react"
import { Button, Chip, CircularProgress, Grid, TextField, Typography } from "@mui/material"
import { usePublicationContext } from "../../../services/publications/contexts"
import { palette, typography } from "../../../theme"
import { ViewContainer } from "../../commons/ViewContainer"
import PublicationPage from "../../layout/PublicationPage"
import CloseIcon from "@mui/icons-material/Close"
import { useNavigate, useParams } from "react-router-dom"
import { UploadFile } from "../../commons/UploadFile"
import { Controller, useForm } from "react-hook-form"
import { maxBy, remove } from "lodash"
import { useFiles } from "../../../hooks/useFiles"
import usePoster from "../../../services/poster/hooks/usePoster"
import { useWeb3React } from "@web3-react/core"
import useArticles from "../../../services/publications/hooks/useArticles"
import { haveActionPermission } from "../../../utils/permission"

export const PreviewPostView: React.FC = () => {
  const navigate = useNavigate()
  const { account } = useWeb3React()
  const { type } = useParams<{ type: "new" | "edit" }>()
  const { publication, article, draftArticle, saveArticle } = usePublicationContext()
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
      const recentArticle = maxBy(data, (article) => {
        if (article.lastUpdated) {
          return parseInt(article.lastUpdated)
        }
      })

      if (recentArticle && recentArticle.title === draftArticle.title) {
        saveArticle(recentArticle)
        navigate(`/publication/${recentArticle.publication?.id}/article/${recentArticle.id}`)
        setLoading(false)
      }
    }
  }, [loading, navigate, data, draftArticle, saveArticle])

  const onSubmitHandler = (data: { description: string }) => {
    handleArticleAction(data)
  }

  const handleArticleAction = async (data: { description: string }) => {
    if (publication && draftArticle && account) {
      let image
      const { description } = data
      const { id } = publication
      const { title, article: draftArticleText } = draftArticle
      if (ipfs && articleImg) {
        image = await uploadFile(articleImg)
      }
      if (title) {
        setLoading(true)
        if (type === "new") {
          await createArticle({
            action: "article/create",
            publicationId: id,
            title,
            article: draftArticleText,
            description,
            tags,
            image: image?.path,
            authors: [account],
          }).then((res) => {
            if (res && res.error) setLoading(false)
          })
        }
        if (type === "edit" && havePermissionToUpdate && article?.id) {
          await updateArticle({
            action: "article/update",
            id: article.id,
            title,
            article: draftArticleText,
            description,
            tags,
            image: image ? image?.path : article.image,
            authors: [account],
          }).then((res) => {
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

  return (
    <PublicationPage publication={publication} showCreatePost={false}>
      <ViewContainer maxWidth="sm">
        <form onSubmit={handleSubmit((data) => onSubmitHandler(data as { description: string }))}>
          <Grid container gap={4} flexDirection="column" mt={12.5}>
            <Grid item>
              <Grid container justifyContent={"space-between"} alignItems="center">
                <Typography
                  color={palette.grays[1000]}
                  variant="h5"
                  fontFamily={typography.fontFamilies.sans}
                  sx={{ margin: 0 }}
                >
                  Post Preview
                </Typography>
                <CloseIcon style={{ cursor: "pointer" }} onClick={() => navigate(-1)} />
              </Grid>
            </Grid>
            <Grid item>
              <UploadFile defaultImage={article?.image} onFileSelected={setArticleImg} />
            </Grid>
            <Grid item>
              <Typography
                color={palette.grays[800]}
                variant="h5"
                fontFamily={typography.fontFamilies.sans}
                sx={{ margin: 0 }}
              >
                {publication?.title}
              </Typography>
            </Grid>

            <Grid item>
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
                fontFamily={typography.fontFamilies.sans}
                sx={{ margin: 0 }}
              >
                Add up to 5 tags so your readers know what this post is about:
              </Typography>
            </Grid>
            <Grid item>
              <TextField
                value={tag}
                onChange={({ target }) => setTag(target.value)}
                sx={{ width: "100%" }}
                placeholder="Add a tag..."
                onKeyPress={handleTagKeyEvent}
              />
            </Grid>
            <Grid item>
              <Grid container gap={1}>
                {tags.map((name, index) => (
                  <Chip label={name} size="small" key={index} onDelete={() => handleDeleteTag(index)} />
                ))}
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" size="large" type="submit" disabled={loading}>
                {loading && <CircularProgress size={20} sx={{ marginRight: 1 }} />}
                {type === "new" ? "Publish now" : "Publish update now"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </ViewContainer>
    </PublicationPage>
  )
}

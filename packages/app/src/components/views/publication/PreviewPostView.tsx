import React, { useState } from "react"
import { Button, Chip, CircularProgress, Grid, TextField, Typography } from "@mui/material"
import { usePublicationContext } from "../../../services/publications/contexts"
import { palette, typography } from "../../../theme"
import { ViewContainer } from "../../commons/ViewContainer"
import PublicationPage from "../../layout/PublicationPage"
import CloseIcon from "@mui/icons-material/Close"
import { useNavigate } from "react-router-dom"
import { UploadFile } from "../../commons/UploadFile"
import { Controller, useForm } from "react-hook-form"
import { remove } from "lodash"
import { useFiles } from "../../../hooks/useFiles"
import usePoster from "../../../services/poster/hooks/usePoster"
import { useWeb3React } from "@web3-react/core"

export const PreviewPostView: React.FC = () => {
  const navigate = useNavigate()
  const { account } = useWeb3React()
  const { publication, draftArticle } = usePublicationContext()
  const [tag, setTag] = useState<string>("")
  const [tags, setTags] = useState<string[]>([])
  const [articleImg, setArticleImg] = useState<File>()
  const { control, handleSubmit } = useForm()
  const { uploadFile, ipfs } = useFiles()
  const { createArticle, loading } = usePoster()

  const onSubmitHandler = (data: { description: string }) => {
    handleCreateArticle(data)
  }

  const handleCreateArticle = async (data: { description: string }) => {
    if (publication && draftArticle && account) {
      let image
      const { description } = data
      const { id } = publication
      const { title, article } = draftArticle
      if (ipfs && articleImg) {
        image = await uploadFile(articleImg)
      }
      if (title) {
        await createArticle({
          action: "article/create",
          publicationId: id,
          title,
          article,
          description,
          tags,
          image: image?.path,
          authors: [account],
        })
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
              <UploadFile onFileSelected={setArticleImg} />
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
              <Button variant="outlined" size="large" type="submit" disabled={loading}>
                {loading && <CircularProgress size={20} sx={{ marginRight: 1 }} />}
                Publish now
              </Button>
            </Grid>
          </Grid>
        </form>
      </ViewContainer>
    </PublicationPage>
  )
}

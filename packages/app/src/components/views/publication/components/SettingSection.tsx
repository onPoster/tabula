import { Box, Button, Chip, CircularProgress, FormHelperText, Grid, TextField, Typography } from "@mui/material"
import { remove } from "lodash"
import React, { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { usePublicationContext } from "../../../../services/publications/contexts"
import { palette, typography } from "../../../../theme"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useFiles } from "../../../../hooks/useFiles"
import usePoster from "../../../../services/poster/hooks/usePoster"
import usePublication from "../../../../services/publications/hooks/usePublication"

type Post = {
  title: string
  description?: string
}

const publicationSchema = yup.object().shape({
  title: yup.string().required(),
  tags: yup.array().min(1),
  description: yup.string(),
  image: yup.string(),
})

export const SettingSection: React.FC = () => {
  const [tags, setTags] = useState<string[]>([])
  const [tag, setTag] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [lastUpdate, setLastUpdate] = useState<number | undefined>(undefined)
  const { publication, saveIsEditing, saveDraftPublicationImage, draftPublicationImage, savePublication } =
    usePublicationContext()
  const { executePublication } = usePoster()
  const { data: publicationRefetch, refetch } = usePublication(publication?.id || "")
  const { uploadFile, ipfs } = useFiles()
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(publicationSchema),
  })

  useEffect(() => {
    saveIsEditing(true)

    // returned function will be called on component unmount
    return () => {
      saveIsEditing(false)
      saveDraftPublicationImage(undefined)
    }
  }, [saveDraftPublicationImage, saveIsEditing])

  useEffect(() => {
    if (publication && !loading && publication.lastUpdated) {
      setValue("title", publication.title)
      setValue("description", publication.description || "")
      setTags(publication.tags || [])
      setLastUpdate(parseInt(publication.lastUpdated))
    }
  }, [loading, publication, setValue])

  //Execute poll interval to know the latest publications indexed
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        refetch()
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [refetch, loading])

  //Method to know recent publication
  useEffect(() => {
    if (publicationRefetch && loading && lastUpdate) {
      if (publicationRefetch.lastUpdated && parseInt(publicationRefetch.lastUpdated) > lastUpdate) {
        savePublication(publicationRefetch)
        setLoading(false)
      }
    }
  }, [lastUpdate, loading, publicationRefetch, savePublication])

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

  const onSubmitHandler = (data: Post) => {
    handlePublication(data)
  }

  const handlePublication = async (data: Post) => {
    setLoading(true)
    const { title, description } = data
    let image
    if (ipfs && draftPublicationImage) {
      image = await uploadFile(draftPublicationImage)
    }
    if (!draftPublicationImage && publication?.image) {
      image = { path: publication.image }
    }
    if (title && publication && publication.id) {
      await executePublication({
        id: publication.id,
        action: "publication/update",
        title,
        description,
        tags,
        image: image?.path,
      }).then((res) => {
        if (res && res.error) setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Typography color={palette.grays[1000]} variant="h5" fontFamily={typography.fontFamilies.sans} mt={4} mb={3}>
        Publication Details
      </Typography>
      <form onSubmit={handleSubmit((data) => onSubmitHandler(data as Post))}>
        <Grid container gap={2} flexDirection="column">
          <Grid item>
            <Controller
              control={control}
              name="title"
              render={({ field }) => (
                <TextField {...field} value={field.value} placeholder="Publication Name" sx={{ width: "100%" }} />
              )}
              rules={{ required: true }}
            />
            {errors && errors.title && (
              <FormHelperText sx={{ color: palette.secondary[1000], textTransform: "capitalize" }}>
                {errors.title.message}
              </FormHelperText>
            )}
          </Grid>
          <Grid item>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <TextField {...field} value={field.value} placeholder="Tagline" sx={{ width: "100%" }} />
              )}
              rules={{ required: true }}
            />
          </Grid>
          <Grid item>
            <TextField
              value={tag}
              sx={{ width: "100%" }}
              onChange={({ target }) => setTag(target.value)}
              placeholder="Add up to 5 tags for your publication..."
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
          <Grid item>
            <Grid container justifyContent="space-between" sx={{mt: 2}}>
              <Button variant="outlined" size="large" type="submit" disabled={loading}>
                {loading && <CircularProgress size={20} sx={{ marginRight: 1 }} />}
                Delete Publication
              </Button>
              <Button variant="contained" size="large" type="submit" disabled={loading}>
                {loading && <CircularProgress size={20} sx={{ marginRight: 1 }} />}
                Update Publication
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

import { Box, Button, Chip, CircularProgress, FormHelperText, Grid, TextField, Typography } from "@mui/material"
import { findIndex, remove } from "lodash"
import React, { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { usePublicationContext } from "../../../../services/publications/contexts"
import { palette, typography } from "../../../../theme"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useFiles } from "../../../../hooks/useFiles"
import usePoster from "../../../../services/poster/hooks/usePoster"
import usePublication from "../../../../services/publications/hooks/usePublication"
import usePublications from "../../../../services/publications/hooks/usePublications"
import { useNavigate } from "react-router-dom"
import { usePosterContext } from "../../../../services/poster/context"
import { useNotification } from "../../../../hooks/useNotification"

type Post = {
  title: string
  description?: string
}

type SettingsSectionProps = {
  couldEdit: boolean
  couldDelete: boolean
}

const publicationSchema = yup.object().shape({
  title: yup.string().required(),
  tags: yup.array().min(1),
  description: yup.string(),
  image: yup.string(),
})

export const SettingSection: React.FC<SettingsSectionProps> = ({ couldDelete, couldEdit }) => {
  const navigate = useNavigate()
  const openNotification = useNotification()
  const [tags, setTags] = useState<string[]>([])
  const [tag, setTag] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false)
  const [lastUpdate, setLastUpdate] = useState<number | undefined>(undefined)
  const { publication, saveIsEditing, saveDraftPublicationImage, draftPublicationImage, savePublication } =
    usePublicationContext()
  const { executePublication, deletePublication } = usePoster()
  const {
    isIndexingPublication,
    isIndexingDeletePublication,
    setIsIndexingPublication,
    setIsIndexingDeletePublication,
    transactionUrl,
  } = usePosterContext()
  const { data: publicationRefetch, refetch } = usePublication(publication?.id || "")
  const { data: publications, refetch: publicationsRefetch } = usePublications()
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

  useEffect(() => {
    if (publications?.length && publication && deleteLoading) {
      const currentPublication = findIndex(publications, { id: publication?.id })
      if (currentPublication === -1) {
        navigate("/publication/publish")
        setDeleteLoading(false)
        setIsIndexingDeletePublication(false)
        openNotification({
          message: "Execute transaction confirmed!",
          autoHideDuration: 5000,
          variant: "success",
          detailsLink: transactionUrl,
        })
      }
    }
  }, [
    publications,
    publication,
    deleteLoading,
    navigate,
    setIsIndexingDeletePublication,
    openNotification,
    transactionUrl,
  ])

  //Execute poll interval to know the latest publications indexed
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        refetch()
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [refetch, loading])

  //Execute poll interval to know the latest publications indexed
  useEffect(() => {
    if (deleteLoading) {
      const interval = setInterval(() => {
        publicationsRefetch()
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [publicationsRefetch, deleteLoading])

  //Method to know recent publication
  useEffect(() => {
    if (publicationRefetch && loading && lastUpdate) {
      if (publicationRefetch.lastUpdated && parseInt(publicationRefetch.lastUpdated) > lastUpdate) {
        savePublication(publicationRefetch)
        setLoading(false)
        setIsIndexingPublication(false)
        openNotification({
          message: "Execute transaction confirmed!",
          autoHideDuration: 5000,
          variant: "success",
          detailsLink: transactionUrl,
        })
      }
    }
  }, [
    lastUpdate,
    loading,
    openNotification,
    publicationRefetch,
    savePublication,
    setIsIndexingPublication,
    transactionUrl,
  ])

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
    handlePublicationUpdate(data)
  }

  const handlePublicationUpdate = async (data: Post) => {
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
        if (res && res.error) {
          setLoading(false)
          setIsIndexingPublication(false)
        }
      })
    } else {
      setLoading(false)
      setIsIndexingPublication(false)
    }
  }

  const handlePublicationDelete = async () => {
    setDeleteLoading(true)
    if (publication && publication.id) {
      await deletePublication({
        action: "publication/delete",
        id: publication.id,
      }).then((res) => {
        if (res && res.error) {
          setDeleteLoading(false)
          setIsIndexingDeletePublication(false)
        }
      })
    } else {
      setDeleteLoading(false)
      setIsIndexingDeletePublication(false)
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
            <Grid container justifyContent="space-between" sx={{ mt: 2 }}>
              {couldDelete && (
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handlePublicationDelete}
                  disabled={deleteLoading || loading || isIndexingDeletePublication}
                >
                  {deleteLoading && <CircularProgress size={20} sx={{ marginRight: 1 }} />}
                  {isIndexingDeletePublication ? "Indexing..." : "Delete Publication"}
                </Button>
              )}
              {couldEdit && (
                <Button
                  variant="contained"
                  size="large"
                  type="submit"
                  disabled={loading || deleteLoading || isIndexingPublication}
                >
                  {loading && <CircularProgress size={20} sx={{ marginRight: 1 }} />}
                  {isIndexingPublication ? "Indexing..." : " Update Publication"}
                </Button>
              )}
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

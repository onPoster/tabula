import React, { useEffect, useState } from "react"
import { Button, Divider, Grid, styled, TextField, Typography, CircularProgress, FormHelperText } from "@mui/material"
import Page from "../../layout/Page"
import { palette, typography } from "../../../theme"
import PublicationAvatar from "../../commons/PublicationAvatar"
import PublicationItem from "../../commons/PublicationItem"
import { useFiles } from "../../../hooks/useFiles"
import usePoster from "../../../services/poster/hooks/usePoster"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm, Controller } from "react-hook-form"
import * as yup from "yup"
import { Publications } from "../../../models/publication"
import { useWeb3React } from "@web3-react/core"
import { useNavigate } from "react-router-dom"
import { accessPublications } from "../../../utils/permission"
import { ViewContainer } from "../../commons/ViewContainer"
import usePublications from "../../../services/publications/hooks/usePublications"
import { CreatableSelect } from "../../commons/CreatableSelect"
import { CreateSelectOption } from "../../../models/dropdown"
import { usePosterContext } from "../../../services/poster/context"

const PublishAvatarContainer = styled(Grid)(({ theme }) => ({
  display: "flex",
  [`${theme.breakpoints.down("md")}`]: {
    justifyContent: "center",
    marginBottom: 20,
  },

  [`${theme.breakpoints.up("lg")}`]: {
    justifyContent: "flex-start",
    alignItems: "center",
    margin: 0,
  },
}))

const PublishButton = styled(Button)(({ theme }) => ({
  [`${theme.breakpoints.down("md")}`]: {
    width: "100%",
  },

  [`${theme.breakpoints.up("lg")}`]: {
    width: "auto",
  },
}))

const PublishDividerTextContainer = styled(Grid)({
  background: palette.grays[100],
  width: 40,
  height: 40,
  borderRadius: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
})

const publicationSchema = yup.object().shape({
  title: yup.string().required(),
  tags: yup.array().min(1),
  description: yup.string(),
  image: yup.string(),
})

type Post = {
  title: string
  description?: string
}

interface PublishViewProps {
  updateChainId: (chainId: number) => void
}

export const PublishView: React.FC<PublishViewProps> = ({ updateChainId }) => {
  const navigate = useNavigate()
  const { account, chainId } = useWeb3React()
  const { executePublication } = usePoster()
  const { setLastPathWithChainName } = usePosterContext()
  const [loading, setLoading] = useState<boolean>(false)
  const {
    data: publications,
    executeQuery,
    indexing,
    redirect,
    lastPublicationId,
    setLastPublicationTitle,
    setExecutePollInterval,
  } = usePublications()
  const [tags, setTags] = useState<string[]>([])
  const [publicationsToShow, setPublicationsToShow] = useState<Publications[]>([])
  const [publicationImg, setPublicationImg] = useState<File>()
  const { uploadFile, ipfs } = useFiles()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(publicationSchema),
  })

  useEffect(() => {
    setLastPathWithChainName(undefined)
  }, [setLastPathWithChainName])

  useEffect(() => {
    if (chainId != null) {
      updateChainId(chainId)
    }
  }, [chainId, updateChainId])

  useEffect(() => {
    if (!publications) {
      executeQuery()
    }
  }, [publications, executeQuery])

  useEffect(() => {
    if (publications && publications.length && account) {
      handlePublicationsToShow(publications, account)
    }
  }, [publications, account])

  useEffect(() => {
    if (redirect && lastPublicationId) {
      setLoading(false)
      navigate(`/publication/${lastPublicationId}`)
    }
  }, [lastPublicationId, navigate, redirect])

  const onSubmitHandler = (data: Post) => {
    setLastPublicationTitle(data.title)
    handlePublication(data)
  }

  const handlePublicationsToShow = (publications: Publications[], address: string) => {
    const show = accessPublications(publications, address)
    setPublicationsToShow(show)
  }

  const handlePublication = async (data: Post) => {
    setLoading(true)
    const { title, description } = data
    let image
    if (ipfs && publicationImg) {
      image = await uploadFile(publicationImg)
    }
    if (title) {
      await executePublication({
        action: "publication/create",
        title,
        description,
        tags,
        image: image?.path,
      }).then((res) => {
        if (res && res.error) {
          setLoading(false)
        } else {
          setExecutePollInterval(true)
        }
      })
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

  return (
    <Page showBadge>
      <form onSubmit={handleSubmit((data) => onSubmitHandler(data as Post))}>
        <ViewContainer maxWidth="sm">
          <Grid mt={10}>
            <Typography color={palette.secondary[1000]} variant="h2" fontFamily={typography.fontFamilies.sans}>
              Welcome to Tabula!
            </Typography>
          </Grid>

          {publicationsToShow.length > 0 && (
            <Grid>
              <Grid container gap={2.5} my={3}>
                <Typography> You&#39;ve been given permission to the following publication(s):</Typography>
                {publicationsToShow.map((publication) => (
                  <PublicationItem
                    publication={publication}
                    key={publication.id}
                    onClick={() => navigate(`/publication/${publication.id}`)}
                  />
                ))}
              </Grid>
              <Grid my={3}>
                <Divider>
                  <PublishDividerTextContainer>
                    <Typography variant="body1" fontFamily={typography.fontFamilies.sans}>
                      OR
                    </Typography>
                  </PublishDividerTextContainer>
                </Divider>
              </Grid>
            </Grid>
          )}
          <Grid>
            <Typography color={palette.grays[1000]} variant="h5" fontFamily={typography.fontFamilies.sans}>
              Create a publication
            </Typography>
            <Typography variant="body1">Set up the publication&#39;s profile</Typography>
          </Grid>
          <Grid container alignItems="center" mt={4}>
            <PublishAvatarContainer item xs={12} md={4} sx={{ display: "flex" }}>
              <PublicationAvatar onFileSelected={setPublicationImg} />
            </PublishAvatarContainer>
            <Grid item xs={12} md={8}>
              <Grid container flexDirection="column" gap={2}>
                <Grid item>
                  <Controller
                    defaultValue=""
                    control={control}
                    name="title"
                    render={({ field }) => (
                      <TextField {...field} placeholder="Publication Name" sx={{ width: "100%" }} />
                    )}
                    rules={{ required: true }}
                  />
                  {errors && errors.title && (
                    <FormHelperText sx={{ color: palette.secondary[1000], textTransform: "capitalize" }}>
                      {errors.title.message}
                    </FormHelperText>
                  )}
                </Grid>

                <Controller
                  defaultValue=""
                  control={control}
                  name="description"
                  render={({ field }) => <TextField {...field} placeholder="Tagline" />}
                />

                <CreatableSelect
                  placeholder="Add up to 5 tags for your publication..."
                  onSelected={handleTags}
                  errorMsg={tags.length && tags.length >= 6 ? "Add up to 5 tags for your publication" : undefined}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item display="flex" justifyContent={"flex-end"} mt={3}>
            <PublishButton variant="contained" type="submit" disabled={loading || indexing}>
              {loading && <CircularProgress size={20} sx={{ marginRight: 1 }} />}
              {indexing ? "Indexing..." : "Create Publication"}
            </PublishButton>
          </Grid>
        </ViewContainer>
      </form>
    </Page>
  )
}

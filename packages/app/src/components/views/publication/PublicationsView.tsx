import React, { useEffect, useState } from "react"
import { Button, Divider, Grid, styled, TextField, Typography, CircularProgress, FormHelperText } from "@mui/material"
import Page from "@/components/layout/Page"
import { palette, typography } from "@/theme"
import PublicationAvatar from "@/components/commons/PublicationAvatar"
import PublicationItem from "@/components/commons/PublicationItem"
import { useIpfs } from "@/hooks/useIpfs"
import usePoster from "@/services/poster/hooks/usePoster"
// import { yupResolver } from "@hookform/resolvers/yup"
import { useForm, Controller } from "react-hook-form"
import * as yup from "yup"
import { Publication } from "@/models/publication"
import { useNavigate } from "react-router-dom"
import { accessPublications } from "@/utils/permission"
import { ViewContainer } from "@/components/commons/ViewContainer"
import usePublications from "@/services/publications/hooks/usePublications"
import { CreatableSelect } from "@/components/commons/CreatableSelect"
import { CreateSelectOption } from "@/models/dropdown"
import { usePosterContext } from "@/services/poster/context"
import { useDynamicFavIcon } from "@/hooks/useDynamicFavIco"
import { usePublicationContext } from "@/services/publications/contexts"
import useLocalStorage from "@/hooks/useLocalStorage"
import { Pinning } from "@/models/pinning"
import { checkPinningRequirements } from "@/utils/pinning"
import { useWeb3ModalAccount } from "@web3modal/ethers5/react"

const PublicationsAvatarContainer = styled(Grid)(({ theme }) => ({
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

const PublicationsButton = styled(Button)(({ theme }) => ({
  [`${theme.breakpoints.down("md")}`]: {
    width: "100%",
  },

  [`${theme.breakpoints.up("lg")}`]: {
    width: "auto",
  },
}))

const PublicationsDividerTextContainer = styled(Grid)({
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

interface PublicationsViewProps {}

export const PublicationsView: React.FC<PublicationsViewProps> = () => {
  const navigate = useNavigate()
  const [pinning] = useLocalStorage<Pinning | undefined>("pinning", undefined)
  const { address } = useWeb3ModalAccount()
  const { executePublication } = usePoster()
  const { setLastPathWithChainName } = usePosterContext()
  useDynamicFavIcon(undefined)
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
  const { setPublicationAvatar } = usePublicationContext()
  const [tags, setTags] = useState<string[]>([])
  const [publicationsToShow, setPublicationsToShow] = useState<Publication[]>([])
  const [publicationImg, setPublicationImg] = useState<File>()
  const ipfs = useIpfs()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    setLastPathWithChainName(undefined)
  }, [setLastPathWithChainName])

  useEffect(() => {
    if (!publications) {
      executeQuery()
    }
  }, [publications, executeQuery])

  useEffect(() => {
    if (publications && publications.length && address) {
      handlePublicationsToShow(publications, address)
    }
  }, [publications, address])

  useEffect(() => {
    setPublicationAvatar(undefined)
  }, [setPublicationAvatar])

  useEffect(() => {
    if (redirect && lastPublicationId) {
      setLoading(false)
      navigate(`../${lastPublicationId}`)
    }
  }, [lastPublicationId, navigate, redirect])

  const onSubmitHandler = (data: Post) => {
    setLastPublicationTitle(data.title)
    handlePublication(data)
  }

  const handlePublicationsToShow = (publications: Publication[], address: string) => {
    const show = accessPublications(publications, address)
    setPublicationsToShow(show)
  }

  const handlePublication = async (data: Post) => {
    setLoading(true)
    const { title, description } = data
    let image
    if (publicationImg && checkPinningRequirements(pinning)) {
      image = await ipfs.uploadContent(publicationImg)
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
                    onClick={() => navigate(`/${publication.id}`)} // TODO: when we have reverse lookup (ens name set in the subgraph by somebody with permission) we can use that here
                  />
                ))}
              </Grid>
              <Grid my={3}>
                <Divider>
                  <PublicationsDividerTextContainer>
                    <Typography variant="body1" fontFamily={typography.fontFamilies.sans}>
                      OR
                    </Typography>
                  </PublicationsDividerTextContainer>
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
            <PublicationsAvatarContainer item xs={12} md={4} sx={{ display: "flex" }}>
              <PublicationAvatar onFileSelected={setPublicationImg} newPublication />
            </PublicationsAvatarContainer>
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
                      {errors.title.message as string}
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
                  limit={5}
                  errorMsg={tags.length && tags.length >= 6 ? "Add up to 5 tags for your publication" : undefined}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item display="flex" justifyContent={"flex-end"} mt={3}>
            <PublicationsButton variant="contained" type="submit" disabled={loading || indexing || tags.length > 5}>
              {loading && <CircularProgress size={20} sx={{ marginRight: 1 }} />}
              {indexing ? "Indexing..." : "Create Publication"}
            </PublicationsButton>
          </Grid>
        </ViewContainer>
      </form>
    </Page>
  )
}

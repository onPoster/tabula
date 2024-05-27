import React, { useEffect, useState } from "react"
import { Button, Divider, Grid, styled, TextField, Typography, CircularProgress } from "@mui/material"
import Page from "@/components/layout/Page"
import { palette, typography } from "@/theme"
import PublicationAvatar from "@/components/commons/PublicationAvatar"
import PublicationItem from "@/components/commons/PublicationItem"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm, Controller } from "react-hook-form"
import { Publication } from "@/models/publication"
import { useNavigate } from "react-router-dom"
import { accessPublications } from "@/utils/permission"
import { ViewContainer } from "@/components/commons/ViewContainer"
import usePublications from "@/services/publications/hooks/usePublications"
import { CreatableSelect } from "@/components/commons/CreatableSelect"
import { usePosterContext } from "@/services/poster/context"
import { useDynamicFavIcon } from "@/hooks/useDynamicFavIco"
import { usePublicationContext } from "@/services/publications/contexts"
import { useWeb3ModalAccount } from "@web3modal/ethers5/react"
import { PublicationFormSchema, publicationSchema } from "@/schemas/publication.schema"
import useLocalStorage from "@/hooks/useLocalStorage"
import { Pinning, PinningService } from "@/models/pinning"
import { AlertContainer } from "@/components/commons/Pinning/PinningConfiguration"
import { TransactionStatus } from "@/hooks/useContract"

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

export const PublicationsView: React.FC = () => {
  useDynamicFavIcon(undefined)
  const navigate = useNavigate()
  const [pinning] = useLocalStorage<Pinning | undefined>("pinning", undefined)
  const { address } = useWeb3ModalAccount()
  const { setLastPathWithChainName } = usePosterContext()
  const { data: publications, createNewPublication, txLoading, status } = usePublications()
  const { create: createLoading } = txLoading
  const { setPublicationAvatar } = usePublicationContext()
  const [publicationsToShow, setPublicationsToShow] = useState<Publication[]>([])
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(publicationSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
      image: undefined,
    },
  })

  useEffect(() => {
    setLastPathWithChainName(undefined)
  }, [setLastPathWithChainName])

  useEffect(() => {
    if (publications && publications.length && address) {
      handlePublicationsToShow(publications, address)
    }
  }, [publications, address])

  useEffect(() => {
    setPublicationAvatar(undefined)
  }, [setPublicationAvatar])

  const onSubmitHandler = async (newPublicationFields: PublicationFormSchema) => {
    await createNewPublication(newPublicationFields)
  }

  const handlePublicationsToShow = (publications: Publication[], address: string) => {
    const show = accessPublications(publications, address)
    setPublicationsToShow(show)
  }

  return (
    <Page showBadge>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
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
              {(!pinning || (pinning && pinning.service !== PinningService.NONE)) && (
                <PublicationAvatar onFileSelected={(fileSelected) => setValue("image", fileSelected)} newPublication />
              )}
              {pinning && pinning.service === PinningService.NONE && (
                <AlertContainer width={"100%"}>
                  <Typography variant="body1" fontWeight={500} color={palette.secondary[1000]}>
                    To enable the publication of images, please set up a pinning service in the settings.
                  </Typography>
                </AlertContainer>
              )}
            </PublicationsAvatarContainer>
            <Grid item xs={12} md={8}>
              <Grid container flexDirection="column" gap={2}>
                <Grid item>
                  <Controller
                    control={control}
                    name="title"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        placeholder="Publication Name"
                        fullWidth
                        error={!!errors.title}
                        helperText={errors.title?.message}
                      />
                    )}
                  />
                </Grid>

                <Controller
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      rows={4}
                      placeholder="Tagline"
                      error={!!errors.description}
                      helperText={errors.description?.message}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="tags"
                  render={({ field, fieldState }) => (
                    <CreatableSelect
                      {...field}
                      control={control}
                      placeholder="Add up to 5 tags for your publication..."
                      errorMsg={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item display="flex" justifyContent={"flex-end"} mt={3}>
            <PublicationsButton
              variant="contained"
              type="submit"
              disabled={createLoading || isSubmitting || status === TransactionStatus.Indexing}
            >
              {createLoading && status === TransactionStatus.Indexing && (
                <CircularProgress size={20} sx={{ marginRight: 1 }} />
              )}
              {status === TransactionStatus.Indexing ? "Indexing..." : "Create Publication"}
            </PublicationsButton>
          </Grid>
        </ViewContainer>
      </form>
    </Page>
  )
}

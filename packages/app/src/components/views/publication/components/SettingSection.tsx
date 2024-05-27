import { Box, Button, CircularProgress, Container, Grid, InputLabel, TextField } from "@mui/material"
import React, { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { usePublicationContext } from "@/services/publications/contexts"
import { palette } from "@/theme"
import { yupResolver } from "@hookform/resolvers/yup"
import usePublications from "@/services/publications/hooks/usePublications"
import { CreatableSelect } from "@/components/commons/CreatableSelect"
import { useEnsContext } from "@/services/ens/context"
import EnsModal from "./EnsModal"
import { SupportedChainId } from "@/constants/chain"
import { useWeb3ModalAccount } from "@web3modal/ethers5/react"
import { PublicationFormSchema, UpdatePublicationFormSchema, publicationSchema } from "@/schemas/publication.schema"
import { TransactionStatus } from "@/hooks/useContract"

type SettingsSectionProps = {
  couldEdit: boolean
  couldDelete: boolean
  removeCurrentImage: boolean
}

export const SettingSection: React.FC<SettingsSectionProps> = ({ couldDelete, couldEdit, removeCurrentImage }) => {
  const { chainId } = useWeb3ModalAccount()
  const [openENSModal, setOpenENSModal] = useState<boolean>(false)

  const { publication, saveIsEditingPublication, saveDraftPublicationImage, draftPublicationImage } =
    usePublicationContext()
  const { ensNameList } = useEnsContext()
  const { deletePublication, updatePublication, txLoading, status } = usePublications()
  const { delete: deleteLoading, update: updateLoading } = txLoading

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: publication?.title ?? "",
      description: publication?.description ?? "",
      tags: publication?.tags ?? [],
      image: publication?.image ?? undefined,
    },
    resolver: yupResolver(publicationSchema),
  })

  useEffect(() => {
    if (removeCurrentImage && !draftPublicationImage) {
      setValue("image", undefined)
    }
    if (!removeCurrentImage && draftPublicationImage) {
      setValue("image", draftPublicationImage)
    }
  }, [removeCurrentImage, draftPublicationImage, setValue])

  useEffect(() => {
    saveIsEditingPublication(true)
    // returned function will be called on component unmount
    return () => {
      saveIsEditingPublication(false)
      saveDraftPublicationImage(undefined)
    }
  }, [saveDraftPublicationImage, saveIsEditingPublication])

  const onSubmitHandler = async (data: PublicationFormSchema) => {
    const form: UpdatePublicationFormSchema = { ...data, id: publication?.id ?? "" }
    await updatePublication(form)
  }

  const handlePublicationDelete = async (publicationId: string) => {
    await deletePublication(publicationId)
  }

  const handleEns = () => {
    if (chainId) {
      if ([SupportedChainId.MAINNET, SupportedChainId.SEPOLIA].includes(chainId)) {
        return setOpenENSModal(true)
      }
    }
  }

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Grid container gap={4} flexDirection="column">
          <Grid item>
            <Controller
              control={control}
              name="title"
              render={({ field }) => (
                <>
                  <InputLabel shrink htmlFor="publication-name">
                    Publication Name
                  </InputLabel>
                  <TextField
                    {...field}
                    id="publication-name"
                    placeholder="Publication Name"
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                </>
              )}
            />
          </Grid>
          <Grid item>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <>
                  <InputLabel shrink htmlFor="publication-description">
                    Description
                  </InputLabel>
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Tagline"
                    id="publication-description"
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                </>
              )}
              rules={{ required: true }}
            />
          </Grid>
          <Grid item>
            <InputLabel shrink>Tags</InputLabel>
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
          {ensNameList && (
            <Grid item>
              <Button
                onClick={handleEns}
                style={{
                  color: palette.primary[1000],
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Link Your Publication to Your ENS Name
              </Button>
            </Grid>
          )}
          {ensNameList && (
            <EnsModal
              open={openENSModal}
              onClose={() => setOpenENSModal(false)}
              publicationId={publication?.id ?? ""}
            />
          )}
          <Grid item>
            <Grid container justifyContent="space-between" sx={{ mt: 2 }}>
              {couldDelete && publication && (
                <Button
                  variant="contained"
                  type="submit"
                  disabled={deleteLoading || updateLoading || isSubmitting || status === TransactionStatus.Indexing}
                  onClick={() => handlePublicationDelete(publication.id)}
                >
                  {deleteLoading && <CircularProgress size={20} sx={{ marginRight: 1 }} />}
                  Delete Publication
                </Button>
              )}

              {couldEdit && (
                <Button
                  variant="contained"
                  size="large"
                  type="submit"
                  onClick={handleSubmit((data) => onSubmitHandler(data))}
                  disabled={deleteLoading || updateLoading || isSubmitting || status === TransactionStatus.Indexing}
                >
                  {updateLoading && status === TransactionStatus.Indexing && (
                    <CircularProgress size={20} sx={{ marginRight: 1 }} />
                  )}
                  {status === TransactionStatus.Indexing ? "Indexing..." : "Update Publication"}
                </Button>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

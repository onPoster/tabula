import { Box, Button, CircularProgress, Container, FormHelperText, Grid, InputLabel, TextField } from "@mui/material"
import React, { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { usePublicationContext } from "../../../../services/publications/contexts"
import { palette } from "../../../../theme"
// import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useIpfs } from "../../../../hooks/useIpfs"
import usePoster from "../../../../services/poster/hooks/usePoster"
import usePublication from "../../../../services/publications/hooks/usePublication"
import usePublications from "../../../../services/publications/hooks/usePublications"
import { useNavigate, useParams } from "react-router-dom"
import { CreatableSelect } from "../../../commons/CreatableSelect"
import { CreateSelectOption } from "../../../../models/dropdown"
import useLocalStorage from "../../../../hooks/useLocalStorage"
import { Pinning, PinningService } from "../../../../models/pinning"
import { useEnsContext } from "../../../../services/ens/context"
import EnsModal from "./EnsModal"
import useENS from "../../../../services/ens/hooks/useENS"
// import { useWeb3React } from "@web3-react/core"

import { SupportedChainId } from "../../../../constants/chain"
import { useWeb3ModalAccount } from "@web3modal/ethers5/react"

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
  const { publicationSlug } = useParams<{ publicationSlug: string }>()
  const navigate = useNavigate()
  const { chainId } = useWeb3ModalAccount()
  const [pinning] = useLocalStorage<Pinning | undefined>("pinning", undefined)
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [openENSModal, setOpenENSModal] = useState<boolean>(false)
  const [openNetworkModal, setOpenNetworkModal] = useState<boolean>(false)
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false)
  const {
    publication,
    saveIsEditingPublication,
    saveDraftPublicationImage,
    draftPublicationImage,
    removePublicationImage,
    setRemovePublicationImage,
  } = usePublicationContext()
  const { ensNameList } = useEnsContext()
  const { fetchNames } = useENS()
  const { executePublication, deletePublication } = usePoster()
  const {
    indexing: updateIndexing,
    setCurrentTimestamp,
    setExecutePollInterval: setUpdateInterval,
    transactionCompleted,
  } = usePublication(publicationSlug || "")
  const { indexing: deleteIndexing, redirect, setExecutePollInterval, setDeletedPublicationId } = usePublications()
  const ipfs = useIpfs()
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(publicationSchema),
  })

  useEffect(() => {
    fetchNames()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    saveIsEditingPublication(true)
    // returned function will be called on component unmount
    return () => {
      saveIsEditingPublication(false)
      saveDraftPublicationImage(undefined)
    }
  }, [saveDraftPublicationImage, saveIsEditingPublication])

  useEffect(() => {
    if (publication && !loading && publication.lastUpdated) {
      setValue("title", publication.title)
      setValue("description", publication.description || "")
      setTags(publication.tags || [])
      setCurrentTimestamp(parseInt(publication.lastUpdated))
    }
  }, [loading, publication, setCurrentTimestamp, setValue])

  useEffect(() => {
    if (publication && !loading && publication.lastUpdated) {
      setValue("title", publication.title)
      setValue("description", publication.description || "")
      setTags(publication.tags || [])
      setCurrentTimestamp(parseInt(publication.lastUpdated))
    }
  }, [loading, publication, setCurrentTimestamp, setValue])

  useEffect(() => {
    if (redirect) {
      navigate("../publications")
    }
  }, [navigate, redirect])

  useEffect(() => {
    if (transactionCompleted) {
      setLoading(false)
      setRemovePublicationImage(false)
    }
  }, [setRemovePublicationImage, transactionCompleted])

  const onSubmitHandler = (data: Post) => {
    handlePublicationUpdate(data)
  }

  const handlePublicationUpdate = async (data: Post) => {
    setLoading(true)
    const { title, description } = data
    let image
    if (draftPublicationImage && pinning && pinning.service !== PinningService.NONE) {
      image = await ipfs.uploadContent(draftPublicationImage)
    }
    if (!draftPublicationImage && publication?.image && !removePublicationImage) {
      image = { path: publication.image }
    }
    if (!draftPublicationImage && publication?.image && removePublicationImage) {
      image = undefined
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
        } else {
          setUpdateInterval(true)
        }
      })
    } else {
      setLoading(false)
    }
    setRemovePublicationImage(false)
  }

  const handlePublicationDelete = async () => {
    setDeleteLoading(true)
    if (publication && publication.id) {
      setDeletedPublicationId(publication.id)
      await deletePublication({
        action: "publication/delete",
        id: publication.id,
      }).then((res) => {
        if (res && res.error) {
          setDeleteLoading(false)
        } else {
          setExecutePollInterval(true)
        }
      })
    } else {
      setDeleteLoading(false)
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

  const handleEns = () => {
    if (chainId) {
      if ([SupportedChainId.MAINNET, SupportedChainId.SEPOLIA].includes(chainId)) {
        return setOpenENSModal(true)
      }
      return setOpenNetworkModal(true)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <form onSubmit={handleSubmit((data) => onSubmitHandler(data as Post))}>
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
                      value={field.value}
                      placeholder="Publication Name"
                      sx={{ width: "100%" }}
                      id="publication-name"
                    />
                  </>
                )}
                rules={{ required: true }}
              />
              {errors && errors.title && (
                <FormHelperText sx={{ color: palette.secondary[1000], textTransform: "capitalize" }}>
                  {errors.title.message as string}
                </FormHelperText>
              )}
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
                      value={field.value}
                      placeholder="Tagline"
                      multiline
                      minRows={4}
                      sx={{ width: "100%" }}
                      id="publication-description"
                    />
                  </>
                )}
                rules={{ required: true }}
              />
            </Grid>
            <Grid item>
              <InputLabel shrink>Tags</InputLabel>
              <CreatableSelect
                placeholder="Add up to 5 tags for your publication..."
                onSelected={handleTags}
                value={tags}
                errorMsg={tags.length && tags.length >= 6 ? "Add up to 5 tags for your publication" : undefined}
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
                {couldDelete && (
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={handlePublicationDelete}
                    disabled={deleteLoading || loading || deleteIndexing || updateIndexing}
                  >
                    {deleteLoading && <CircularProgress size={20} sx={{ marginRight: 1 }} />}
                    {deleteIndexing ? "Indexing..." : "Delete Publication"}
                  </Button>
                )}
                {couldEdit && (
                  <Button
                    variant="contained"
                    size="large"
                    type="submit"
                    disabled={loading || deleteLoading || deleteIndexing || updateIndexing}
                  >
                    {loading && <CircularProgress size={20} sx={{ marginRight: 1 }} />}
                    {updateIndexing ? "Indexing..." : " Update Publication"}
                  </Button>
                )}
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  )
}

import React, { useEffect, useState } from "react"
import {
  Grid,
  Box,
  Typography,
  styled,
  TextField,
  Divider,
  Button,
  FormHelperText,
  CircularProgress,
} from "@mui/material"
import { palette, typography } from "../../../theme"
import CloseIcon from "@mui/icons-material/Close"
import { useNavigate, useParams } from "react-router-dom"
import { CustomCheckbox } from "../../commons/Checkbox"
import { Controller, useForm } from "react-hook-form"

import { ethers } from "ethers"
import usePoster from "../../../services/poster/hooks/usePoster"
import { usePublicationContext } from "../../../services/publications/contexts"
import usePublication from "../../../services/publications/hooks/usePublication"
import { find } from "lodash"
import { WalletBadge } from "../../commons/WalletBadge"

type OptionsType = {
  label: string
  key:
    | "articleCreate"
    | "articleUpdate"
    | "articleDelete"
    | "publicationDelete"
    | "publicationUpdate"
    | "publicationPermissions"
}

type PermissionFormType = {
  articleCreate: boolean
  articleDelete: boolean
  articleUpdate: boolean
  publicationDelete: boolean
  publicationPermissions: boolean
  publicationUpdate: boolean
  account: string
}

const PermissionContainer = styled(Grid)({
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  gap: 24,
  flexDirection: "column",
})

const ARTICLES_OPTIONS: OptionsType[] = [
  {
    label: "Can create posts",
    key: "articleCreate",
  },
  {
    label: "Can edit posts",
    key: "articleUpdate",
  },
  {
    label: "Can delete posts",
    key: "articleDelete",
  },
]
const PUBLICATIONS_OPTIONS: OptionsType[] = [
  {
    label: "Can delete the publication",
    key: "publicationDelete",
  },

  {
    label: "Can edit the publication",
    key: "publicationUpdate",
  },
  {
    label: "Can edit the publication permissions",
    key: "publicationPermissions",
  },
]

const INITIAL_VALUE = {
  articleCreate: false,
  articleDelete: false,
  articleUpdate: false,
  publicationDelete: false,
  publicationPermissions: false,
  publicationUpdate: false,
  account: "",
}

export const PermissionView: React.FC = () => {
  const navigate = useNavigate()
  const { givePermission } = usePoster()
  const { type } = useParams<{ type: "edit" | "new" }>()
  const { publication, permission, savePublication } = usePublicationContext()
  const { data: publicationRefetch, refetch } = usePublication(publication?.id || "")
  const [loading, setLoading] = useState<boolean>(false)
  const {
    control,
    handleSubmit,
    watch,
    clearErrors,
    setError,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: INITIAL_VALUE,
  })
  const account = watch("account")

  useEffect(() => {
    if (type === "edit" && permission) {
      const {
        articleCreate,
        articleDelete,
        articleUpdate,
        publicationDelete,
        publicationPermissions,
        publicationUpdate,
      } = permission
      setValue("articleCreate", articleCreate)
      setValue("articleDelete", articleDelete)
      setValue("articleUpdate", articleUpdate)
      setValue("publicationDelete", publicationDelete)
      setValue("publicationPermissions", publicationPermissions)
      setValue("publicationUpdate", publicationUpdate)
    }
  }, [type, setValue, permission])

  console.log("watch()", watch())

  useEffect(() => {
    if (account) {
      const isValid = ethers.utils.isAddress(account)
      if (!isValid) {
        setError("account", {
          type: "manual",
          message: "Please provide a valid address",
        })
      } else {
        clearErrors("account")
      }
    }
  }, [account, setError, clearErrors])

  //Execute poll interval to know the latest permission indexed
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        refetch()
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [refetch, loading])

  //Check if the new permission is already indexed
  useEffect(() => {
    const permissions = publicationRefetch?.permissions || []
    if (permissions && permissions.length > 0 && account) {
      const isIndexed = find(permissions, { address: account.toLowerCase() })
      if (isIndexed) {
        setLoading(false)
        savePublication(publicationRefetch)
        navigate(-1)
      }
    }
  }, [savePublication, account, publicationRefetch, navigate])

  const onSubmitHandler = (data: PermissionFormType) => {
    if (type === "new") {
      handleNewPermission(data, "new")
    }
    if (type === "edit") {
      handleNewPermission(data, "edit")
    }
  }

  const handleNewPermission = async (data: PermissionFormType, type: "new" | "edit") => {
    if (publication) {
      setLoading(true)
      await givePermission({
        action: "publication/permissions",
        id: publication.id,
        account: type === "new" ? data.account : permission?.address || "",
        permissions: {
          "article/create": data.articleCreate,
          "article/update": data.articleUpdate,
          "article/delete": data.articleDelete,
          "publication/delete": data.publicationDelete,
          "publication/update": data.publicationUpdate,
          "publication/permissions": data.publicationPermissions,
        },
      }).then((res) => {
        if (res && res.error) setLoading(false)
      })
    }
  }

  return (
    <PermissionContainer container>
      <Grid container maxWidth={350} flexDirection="column" gap={3}>
        <Grid item width={"100%"}>
          <Box display="flex" alignItems={"center"} justifyContent={"space-between"} mb={2}>
            <Typography fontFamily={typography.fontFamilies.sans} variant="h5" m={0}>
              {type === "new" ? "Add new permission" : "Update permission"}
            </Typography>
            <CloseIcon style={{ cursor: "pointer" }} onClick={() => navigate(-1)} />
          </Box>
        </Grid>
        <Grid item width={"100%"}>
          <form onSubmit={handleSubmit((data) => onSubmitHandler(data as PermissionFormType))}>
            <Grid container flexDirection="column" gap={3}>
              {type === "new" && (
                <Grid item>
                  <Controller
                    control={control}
                    name={"account"}
                    render={({ field }) => (
                      <TextField {...field} placeholder="Permission address" sx={{ width: "100%" }} />
                    )}
                  />
                  {errors && errors.account && (
                    <FormHelperText sx={{ color: palette.secondary[1000], textTransform: "capitalize" }}>
                      {errors.account.message}
                    </FormHelperText>
                  )}
                </Grid>
              )}
              {type === "edit" && permission && (
                <Grid item>
                  <WalletBadge address={permission.address} />
                </Grid>
              )}
              <Grid item>
                <Grid container flexDirection="column" gap={1}>
                  <Grid item>
                    <Typography fontFamily={typography.fontFamilies.sans} variant="body1" fontWeight={"bold"}>
                      Post Permissions
                    </Typography>
                  </Grid>
                  {ARTICLES_OPTIONS.map(({ key, label }) => (
                    <Grid item key={key}>
                      <Controller
                        control={control}
                        name={key}
                        render={({ field }) => <CustomCheckbox {...field} checked={field.value} label={label} />}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              <Grid item>
                <Grid container flexDirection="column" gap={1}>
                  <Grid item>
                    <Typography fontFamily={typography.fontFamilies.sans} variant="body1" fontWeight={"bold"}>
                      Publication Permissions
                    </Typography>
                  </Grid>
                  {PUBLICATIONS_OPTIONS.map(({ key, label }) => (
                    <Grid item key={key}>
                      <Controller
                        control={control}
                        name={key}
                        render={({ field }) => <CustomCheckbox {...field} checked={field.value} label={label} />}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              <Divider />

              {type === "new" && (
                <Grid item display="flex" justifyContent={"flex-end"}>
                  <Button variant="contained" size="medium" disabled={loading} type="submit">
                    {loading && <CircularProgress size={20} sx={{ marginRight: 1 }} />}
                    Add Permission
                  </Button>
                </Grid>
              )}

              {type === "edit" && (
                <Grid item display="flex" justifyContent={"space-between"}>
                  <Button variant="outlined" size="medium" onClick={() => navigate("/publication/permission")}>
                    Delete
                  </Button>
                  <Button variant="contained" size="medium" disabled={loading} type="submit">
                    {loading && <CircularProgress size={20} sx={{ marginRight: 1 }} />}
                    Update
                  </Button>
                </Grid>
              )}
            </Grid>
          </form>
        </Grid>
      </Grid>
    </PermissionContainer>
  )
}

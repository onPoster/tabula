import React, { useEffect, useState } from "react"
import { Grid, Box, Typography, styled, TextField, Divider, Button, CircularProgress, InputLabel } from "@mui/material"
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline"
import { palette, typography } from "@/theme"
import CloseIcon from "@mui/icons-material/Close"
import { useNavigate, useParams } from "react-router-dom"
import { CustomCheckbox } from "@/components/commons/Checkbox"
import { Controller, useForm } from "react-hook-form"
import { usePublicationContext } from "@/services/publications/contexts"
import { WalletBadge } from "@/components/commons/WalletBadge"
import { yupResolver } from "@hookform/resolvers/yup"
import { PermissionFormSchema, permissionsSchema } from "@/schemas/permission.schema"
import usePublications from "@/services/publications/hooks/usePublications"
import { TransactionStatus } from "@/hooks/useContract"

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

const PermissionContainer = styled(Grid)({
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  gap: 24,
  flexDirection: "column",
})

const RemoveUserButton = styled(Button)({
  border: `2px solid ${palette.grays[400]}`,
  background: palette.whites[400],
  color: palette.grays[800],
  "&:hover": {
    background: palette.whites[1000],
  },
})

const ARTICLES_OPTIONS: OptionsType[] = [
  {
    label: "Can create article",
    key: "articleCreate",
  },
  {
    label: "Can edit article",
    key: "articleUpdate",
  },
  {
    label: "Can delete article",
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

export const PermissionView: React.FC = () => {
  const navigate = useNavigate()

  // const { givePermission } = usePoster()
  const { type } = useParams<{ type: "edit" | "new"; publicationSlug: string }>()
  const { publication, permission, savePermission } = usePublicationContext()
  const { txLoading, givePermission, status } = usePublications()
  const [deleteLoading, setDeleteloading] = useState<boolean>(false)
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      articleCreate: permission?.articleCreate ?? false,
      articleDelete: permission?.articleDelete ?? false,
      articleUpdate: permission?.articleUpdate ?? false,
      publicationDelete: permission?.publicationDelete ?? false,
      publicationPermissions: permission?.publicationPermissions ?? false,
      publicationUpdate: permission?.publicationUpdate ?? false,
      account: permission?.address ?? "",
    },
    resolver: yupResolver(permissionsSchema),
  })

  useEffect(() => {
    if (status === TransactionStatus.Success) {
      setDeleteloading(false)
      savePermission(undefined)
      navigate(-1)
    }
  }, [navigate, savePermission, status])

  const onSubmitHandler = async (data: PermissionFormSchema) => {
    if (publication?.id) {
      await givePermission(publication.id, data)
    }
  }

  const handleDeletePermission = async () => {
    if (publication?.id && permission) {
      setDeleteloading(true)
      await givePermission(publication.id, {
        articleCreate: false,
        articleDelete: false,
        articleUpdate: false,
        publicationDelete: false,
        publicationPermissions: false,
        publicationUpdate: false,
        account: permission?.address,
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
          <form onSubmit={handleSubmit((data) => onSubmitHandler(data as PermissionFormSchema))}>
            <Grid container flexDirection="column" gap={3}>
              {type === "new" && (
                <Grid item>
                  <Controller
                    control={control}
                    name={"account"}
                    render={({ field }) => (
                      <>
                        <InputLabel sx={{ fontSize: 14, mb: 1 }}>Address</InputLabel>
                        <TextField
                          {...field}
                          placeholder="Permission address"
                          fullWidth
                          error={!!errors.account}
                          helperText={errors.account?.message}
                        />
                      </>
                    )}
                  />
                </Grid>
              )}
              {type === "edit" && permission && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row",
                    spacing: 1,
                  }}
                >
                  <WalletBadge address={permission.address} />
                  <RemoveUserButton
                    variant="contained"
                    size="small"
                    onClick={handleDeletePermission}
                    disabled={txLoading.update || deleteLoading}
                    startIcon={<RemoveCircleOutlineIcon />}
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    {deleteLoading && <CircularProgress size={20} sx={{ marginRight: 1 }} />}
                    Remove User
                  </RemoveUserButton>
                </Box>
              )}
              <Grid item flexDirection="column">
                <Typography fontFamily={typography.fontFamilies.sans} variant="body1" fontWeight={"bold"}>
                  Article Permissions
                </Typography>
                {ARTICLES_OPTIONS.map(({ key, label }) => (
                  <Box>
                    <Controller
                      control={control}
                      name={key}
                      render={({ field }) => <CustomCheckbox {...field} checked={field.value} label={label} />}
                    />
                  </Box>
                ))}
              </Grid>

              <Grid item flexDirection="column">
                <Typography fontFamily={typography.fontFamilies.sans} variant="body1" fontWeight={"bold"}>
                  Publication Permissions
                </Typography>
                {PUBLICATIONS_OPTIONS.map(({ key, label }) => (
                  <Controller
                    control={control}
                    name={key}
                    key={key}
                    render={({ field }) => <CustomCheckbox {...field} checked={field.value} label={label} />}
                  />
                ))}
              </Grid>

              <Divider />

              {type === "new" && (
                <Grid item display="flex" justifyContent="flex-end">
                  <Button variant="contained" size="medium" disabled={txLoading.update} type="submit">
                    {txLoading.update && <CircularProgress size={20} sx={{ marginRight: 1 }} />}
                    Add Permission
                  </Button>
                </Grid>
              )}

              {type === "edit" && (
                <Grid item display="flex" justifyContent="flex-end">
                  <Button variant="contained" size="medium" disabled={txLoading.update || deleteLoading} type="submit">
                    {txLoading.update && !deleteLoading && <CircularProgress size={20} sx={{ marginRight: 1 }} />}
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

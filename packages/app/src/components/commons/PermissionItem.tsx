import React, { useEffect, useState } from "react"
import { Box, Grid, Stack } from "@mui/material"
import { styled } from "@mui/styles"
import { palette } from "../../theme"
import { Permission, Publication } from "../../models/publication"
import EditIcon from "@mui/icons-material/Edit"
import CloseIcon from "@mui/icons-material/Close"
import { UserBadge } from "./UserBadge"
import usePublication from "../../services/publications/hooks/usePublication"
import { PermissionFormType } from "../views/publication/PermissionView"
import usePoster from "../../services/poster/hooks/usePoster"
import { useNavigate, useParams } from "react-router-dom"

const PermissionItemContainer = styled(Box)({
  alignItems: "center",
  justifyContent: "space-between",
  display: "flex",
})

const PermissionItemEditContainer = styled(Grid)({
  alignItems: "center",
  border: `2px solid ${palette.grays[400]}`,
  background: palette.whites[400],
  borderRadius: 4,
  color: palette.grays[800],
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  padding: 4,
  "&:hover": {
    background: palette.whites[1000],
  },
})

type PermissionItemProps = {
  publication: Publication | undefined
  permission: Permission
  canEdit: boolean
  showRemove: boolean
  onClick: (id: string) => void
}
const PermissionItem: React.FC<PermissionItemProps> = ({ publication, permission, canEdit, showRemove, onClick }) => {
  const { publicationSlug } = useParams<{ publicationSlug: string }>()
  const { address, id } = permission
  const navigate = useNavigate()
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false)
  const {
    indexing: deleteIndexing,
    setExecutePollInterval: deleteInterval,
    transactionCompleted: deleteTransaction,
    setCurrentUserPermission,
  } = usePublication(publicationSlug || "")

  const { givePermission } = usePoster()
  const handlePermission = async (data: PermissionFormType) => {
    if (publication) {
      await givePermission({
        action: "publication/permissions",
        id: publication.id,
        account: permission?.address || "",
        permissions: {
          "article/create": data.articleCreate,
          "article/update": data.articleUpdate,
          "article/delete": data.articleDelete,
          "publication/delete": data.publicationDelete,
          "publication/update": data.publicationUpdate,
          "publication/permissions": data.publicationPermissions,
        },
      }).then((res) => {
        if (res && res.error) {
          setDeleteLoading(false)
        } else {
          deleteInterval(true)
        }
      })
    }
  }

  useEffect(() => {
    if (deleteTransaction) {
      navigate(-1)
    }
  }, [deleteTransaction, navigate])

  const handleDeletePermission = () => {
    if (publication && publication.permissions) {
      setDeleteLoading(true)
      setCurrentUserPermission(publication.permissions)
      handlePermission({
        articleCreate: false,
        articleDelete: false,
        articleUpdate: false,
        publicationDelete: false,
        publicationPermissions: false,
        publicationUpdate: false,
        account: "",
      })
    }
  }

  return (
    <PermissionItemContainer>
      <UserBadge address={address} />
      <Stack spacing={2} direction="row" alignItems="center">
        {canEdit && (
          <PermissionItemEditContainer
            onClick={() => {
              if (!deleteLoading || !deleteIndexing) {
                canEdit && onClick(id ? id : "")
              }
            }}
          >
            <EditIcon sx={{ width: 20, height: 20 }} />
          </PermissionItemEditContainer>
        )}
        {showRemove && (
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 999,
              bgcolor: palette.grays[800],
              cursor: "pointer",
              width: 16,
              height: 16,
              "&:hover": {
                bgcolor: palette.grays[1000],
              },
            }}
            onClick={() => {
              if (!deleteLoading || !deleteIndexing) {
                handleDeletePermission()
              }
            }}
          >
            <CloseIcon
              sx={{ color: palette.whites[1000], stroke: palette.whites[1000], width: 10, height: 10, strokeWidth: 1 }}
            />
          </Box>
        )}
      </Stack>
    </PermissionItemContainer>
  )
}

export default PermissionItem

import { Avatar, Badge, Stack } from "@mui/material"
import { styled } from "@mui/styles"
import React, { ChangeEvent, useEffect, useRef, useState } from "react"
import { palette, typography } from "../../theme"
import AddIcon from "@mui/icons-material/Add"
import ClearIcon from "@mui/icons-material/Clear"
import EditIcon from "@mui/icons-material/Edit"
import { useIpfs } from "../../hooks/useIpfs"
import { usePublicationContext } from "../../services/publications/contexts"
import { useDynamicFavIcon } from "../../hooks/useDynamicFavIco"

const SmallAvatar = styled(Avatar)({
  width: 40,
  height: 40,
  border: `2px solid ${palette.secondary[400]}`,
  cursor: "pointer",
})

type PublicationAvatarProps = {
  defaultImage?: string | null | undefined
  onFileSelected: (file: File) => void
  newPublication?: boolean
}

const PublicationAvatar: React.FC<PublicationAvatarProps> = ({ defaultImage, onFileSelected, newPublication }) => {
  const [file, setFile] = useState<File>()
  const inputFile = useRef<HTMLInputElement | null>(null)
  const openImagePicker = () => inputFile && inputFile.current?.click()
  const [uri, setUri] = useState<string | undefined>(undefined)
  const [deterministicUri, setDeterministicUri] = useState<string>()
  const [defaultImageSrc, setDefaultImageSrc] = useState<string>("")
  const { publicationAvatar, setRemovePublicationImage, removePublicationImage } = usePublicationContext()
  const ipfs = useIpfs()
  useDynamicFavIcon(uri)

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader()
      reader.onload = (e) => {
        setUri(e.target?.result as string)
      }
      setFile(event.target.files[0])
      reader.readAsDataURL(event.target.files[0])
    }
  }

  useEffect(() => {
    if (file) {
      onFileSelected(file)
      setRemovePublicationImage(false)
    }
  }, [file, onFileSelected, setRemovePublicationImage])

  useEffect(() => {
    const getDefaultImageSrc = async () => {
      if (defaultImage) {
        const src = await ipfs.getImgSrc(defaultImage)
        setDefaultImageSrc(src)
      }
    }
    if (defaultImage != null && defaultImageSrc === "" && !removePublicationImage) {
      if (defaultImage.includes("https://")) {
        return setDefaultImageSrc(defaultImage)
      }
      getDefaultImageSrc()
    }
    if (!defaultImage && defaultImageSrc === "" && !removePublicationImage && publicationAvatar && !newPublication) {
      setDeterministicUri(publicationAvatar.uri)
      setUri(publicationAvatar.uri)
      return setDefaultImageSrc(publicationAvatar.uri)
    }
    if (!defaultImage && !uri && defaultImageSrc) {
      return setDefaultImageSrc("")
    }
    if (!deterministicUri && publicationAvatar) {
      setDeterministicUri(publicationAvatar.uri)
    }
  }, [
    defaultImage,
    ipfs,
    defaultImageSrc,
    removePublicationImage,
    publicationAvatar,
    newPublication,
    uri,
    deterministicUri,
  ])

  const handlerImageAction = () => {
    if (!uri && (!defaultImage || removePublicationImage)) {
      return openImagePicker()
    }
  }

  const deleteImage = (isDeterministic: boolean) => {
    setFile(undefined)
    setUri(undefined)
    setDefaultImageSrc("")
    setRemovePublicationImage(true)
    if (isDeterministic) {
      return openImagePicker()
    }
  }

  const handleShowImg = (): string | undefined => {
    if (uri) {
      return uri
    }
    if (defaultImageSrc) {
      return defaultImageSrc
    }
    if (deterministicUri && !newPublication) {
      return deterministicUri
    }
    return undefined
  }

  return (
    <Stack direction="row" spacing={2}>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        badgeContent={
          <>
            {!uri && (!defaultImage || removePublicationImage) && (
              <SmallAvatar
                sx={{
                  bgcolor: palette.primary[1000],
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "#B34A03",
                  },
                }}
                onClick={handlerImageAction}
              >
                {newPublication ? <AddIcon /> : <EditIcon />}
              </SmallAvatar>
            )}
            {(uri || defaultImage) && !removePublicationImage && (
              <SmallAvatar
                sx={{
                  bgcolor: palette.primary[1000],
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "#B34A03",
                  },
                }}
                onClick={() => deleteImage(deterministicUri === uri ? true : false)}
              >
                {deterministicUri === uri ? <EditIcon /> : <ClearIcon />}
              </SmallAvatar>
            )}
          </>
        }
      >
        <Avatar
          src={handleShowImg()}
          onClick={openImagePicker}
          sx={{
            width: 160,
            height: 160,
            bgcolor: "#f3f3f3",
            border: 4,
            borderColor: palette.grays[200],
            color: palette.grays[400],
            textAlign: "center",
            fontSize: 14,
            fontFamily: typography.fontFamilies.sans,
            cursor: "pointer",
            "&:hover": {
              bgcolor: palette.grays[100],
            },
          }}
        >
          Add a <br />
          publication image.
        </Avatar>
      </Badge>
      <input type="file" id="file" ref={inputFile} hidden accept="image/*" onChange={handleImage} />
    </Stack>
  )
}

export default PublicationAvatar

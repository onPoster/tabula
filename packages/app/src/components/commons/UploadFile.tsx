import React, { ChangeEvent, useEffect, useRef, useState } from "react"
import { Fab, Grid, styled, Typography } from "@mui/material"
import Box from "@mui/material/Box"
import { palette } from "../../theme"
import AddIcon from "@mui/icons-material/Add"
import ClearIcon from "@mui/icons-material/Clear"
import { useIpfs } from "../../hooks/useIpfs"

const UploadFileContainer = styled(Grid)({
  justifyContent: "center",
  alignItems: "center",
  minHeight: 213,
  border: `1px solid ${palette.grays[200]}`,
  background: palette.grays[100],
  cursor: "pointer",
  borderRadius: 4,
  flexDirection: "column",
  "&:hover": {
    background: palette.grays[200],
  },
})

const UploadContainer = styled(Grid)({
  cursor: "pointer",
  display: "flex",
  position: "relative",
  "&:hover img": {
    opacity: 0.8,
  },
})

const UploadEditButton = styled(Fab)({
  position: "absolute",
  bottom: -16,
  right: -16,
})

type UploadFileProps = {
  defaultImage?: string | undefined | null
  onFileSelected: (file: File | undefined) => void
}

export const UploadFile: React.FC<UploadFileProps> = ({ defaultImage, onFileSelected }) => {
  const inputFile = useRef<HTMLInputElement | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uri, setUri] = useState<string | null>(null)
  const [imageHash, setImageHash] = useState<string | undefined | null>(defaultImage)
  const [defaultImageSrc, setDefaultImageSrc] = useState<string>("")
  const ipfs = useIpfs()

  useEffect(() => {
    if (file) onFileSelected(file)
  }, [file, onFileSelected])

  useEffect(() => {
    const getDefaultImageSrc = async () => {
      if (defaultImage) {
        const src = await ipfs.getImgSrc(defaultImage)
        setDefaultImageSrc(src)
      }
    }
    if (ipfs.isReady && defaultImage != null && defaultImageSrc === "") {
      getDefaultImageSrc()
    }
  }, [defaultImage, ipfs, defaultImageSrc])

  const openImagePicker = () => inputFile && inputFile.current?.click()

  const removeImage = () => {
    setFile(null)
    setUri(null)
    setImageHash(null)
  }
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

  return (
    <>
      {!imageHash && !uri && (
        <UploadFileContainer container gap={1} onClick={openImagePicker}>
          <AddIcon />
          <Typography textAlign="center" color={palette.grays[600]} lineHeight={1.25} maxWidth="50%">
            Include a high-quality image in your post to make it more inviting.
          </Typography>
        </UploadFileContainer>
      )}
      {(imageHash || uri) && (
        <Box sx={{ position: "relative" }}>
          <UploadContainer onClick={openImagePicker}>
            <Box component="img" sx={{ borderRadius: 1 }} alt="Article image" src={uri ? uri : defaultImageSrc} />
          </UploadContainer>
          {(imageHash || uri) && (
            <UploadEditButton color="primary" aria-label="edit" onClick={removeImage}>
              <ClearIcon />
            </UploadEditButton>
          )}
        </Box>
      )}
      <input type="file" id="file" ref={inputFile} hidden accept="image/*" onChange={handleImage} />
    </>
  )
}

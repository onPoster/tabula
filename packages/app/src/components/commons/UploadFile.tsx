import React, { ChangeEvent, useEffect, useRef, useState } from "react"
import { Fab, Grid, styled, Typography } from "@mui/material"
import Box from "@mui/material/Box"
import { palette } from "../../theme"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"

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
  }
})

const UploadContainer = styled(Grid)({
  position: "relative",
})

const UploadEditButton = styled(Fab)({
  position: "absolute",
  bottom: -16,
  right: -16,
})

type UploadFileProps = {
  defaultImage?: string | undefined | null
  onFileSelected: (file: File) => void
}

export const UploadFile: React.FC<UploadFileProps> = ({ defaultImage, onFileSelected }) => {
  const inputFile = useRef<HTMLInputElement | null>(null)
  const [file, setFile] = useState<File>()
  const [uri, setUri] = useState<string | null>(null)

  useEffect(() => {
    if (file) onFileSelected(file)
  }, [file, onFileSelected])

  const openImagePicker = () => inputFile && inputFile.current?.click()

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
      {!defaultImage && !uri && (
        <UploadFileContainer container gap={1} onClick={openImagePicker}>
          <AddIcon />
          <Typography textAlign="center" color={palette.grays[600]} lineHeight={1.25} maxWidth="50%">
            Include a high-quality image in your post to make it more inviting.
          </Typography>
        </UploadFileContainer>
      )}
      {(defaultImage || uri) && (
        <UploadContainer>
          <Box
            component="img"
            style={{
              height: 213,
              borderRadius: 4,
              objectFit: "cover",
            }}
            alt="Article image"
            src={uri ? uri : `https://ipfs.infura.io/ipfs/${defaultImage}`}
          />
          <UploadEditButton color="primary" aria-label="edit" onClick={openImagePicker}>
            <EditIcon />
          </UploadEditButton>
        </UploadContainer>
      )}
      <input type="file" id="file" ref={inputFile} hidden accept="image/*" onChange={handleImage} />
    </>
  )
}

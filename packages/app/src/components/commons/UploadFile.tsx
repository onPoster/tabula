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
  onFileSelected: (file: File) => void
}

export const UploadFile: React.FC<UploadFileProps> = ({ onFileSelected }) => {
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
      {!uri && (
        <UploadFileContainer container gap={2} onClick={openImagePicker}>
          <Grid item>
            <AddIcon />
          </Grid>
          <Grid item>
            <Grid container gap={1} flexDirection="column" justifyContent="center" alignItems="center">
              <Typography color={palette.grays[600]}>Include a high-quality image in your</Typography>
              <Typography color={palette.grays[600]}>post to make it more inviting.</Typography>
            </Grid>
          </Grid>
        </UploadFileContainer>
      )}
      {uri && (
        <UploadContainer>
          <Box
            component="img"
            style={{
              height: 213,
              borderRadius: 4,
              objectFit: "cover",
            }}
            alt="Article image"
            src={uri}
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

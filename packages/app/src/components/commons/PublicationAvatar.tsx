import { Avatar, Badge, Stack } from "@mui/material"
import { styled } from "@mui/styles"
import React, { ChangeEvent, useEffect, useRef, useState } from "react"
import { palette } from "../../theme"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"

const SmallAvatar = styled(Avatar)({
  width: 40,
  height: 40,
  border: `2px solid ${palette.secondary[400]}`,
  cursor: "pointer",
})

type PublicationAvatarProps = {
  onFileSelected: (file: File) => void
}

const PublicationAvatar: React.FC<PublicationAvatarProps> = ({ onFileSelected }) => {
  const [file, setFile] = useState<File>()
  const inputFile = useRef<HTMLInputElement | null>(null)
  const openImagePicker = () => inputFile && inputFile.current?.click()
  const [uri, setUri] = useState<string | undefined>(undefined)

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
    if (file) onFileSelected(file)
  }, [file, onFileSelected])

  return (
    <Stack direction="row" spacing={2}>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        badgeContent={
          <SmallAvatar sx={{ bgcolor: palette.primary[1000] }} onClick={openImagePicker}>
            {!uri && <AddIcon />}
            {uri && <EditIcon />}
            <input type="file" id="file" ref={inputFile} hidden accept="image/*" onChange={handleImage} />
          </SmallAvatar>
        }
      >
        <Avatar
          src={uri}
          sx={{ width: 160, height: 160, bgcolor: "#f3f3f3", border: 4, borderColor: palette.grays[200] }}
        >
          {" "}
        </Avatar>
      </Badge>
    </Stack>
  )
}

export default PublicationAvatar

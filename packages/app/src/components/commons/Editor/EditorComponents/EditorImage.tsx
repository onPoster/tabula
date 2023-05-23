import Add from "@mui/icons-material/Add"
import { Box, InputLabel } from "@mui/material"
import React, { ChangeEvent, useRef, useState } from "react"
import { palette, typography } from "../../../../theme"
import { EditorState } from "draft-js"

export interface EditorImageProps {
  blockProps: {
    editorState: EditorState
    src: string
    insertImage: (uri: string, file: File) => void
  }
}

const EditorImage: React.FC<EditorImageProps> = (props) => {
  const selection = props.blockProps.editorState.getSelection()
  const anchorKey = selection.getAnchorKey()
  const id = `${anchorKey}_fileInput`
  const inputFile = useRef<HTMLInputElement | null>(null)
  const [uri, setUri] = useState<string | null | undefined>(null)

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    console.log("event", event)
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader()
      let imgUri = ""
      reader.onload = (e) => {
        setUri(e.target?.result as string)
        imgUri = e.target?.result as string
      }

      reader.onloadend = () => {
        if (props.blockProps.insertImage && event.target.files?.length) {
          props.blockProps.insertImage(imgUri, event.target.files[0])
        }
      }

      reader.readAsDataURL(event.target.files[0])
    }
  }

  return (
    <Box>
      <input type="file" id={id} ref={inputFile} hidden accept="image/*" onChange={handleImage} />
      {!uri && (
        <InputLabel
          htmlFor={id}
          sx={{
            alignItems: "center",
            backdropFilter: "blur(2px)",
            backgroundColor: palette.grays[50],
            border: `1px solid ${palette.grays[200]}`,
            borderRadius: 1,
            cursor: "pointer",
            color: palette.grays[600],
            fontFamily: typography.fontFamilies.serif,
            fontSize: 14,
            textTransform: "unset",
            letterSpacing: "unset",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minHeight: 160,
            "&:hover": {
              background: palette.grays[200],
            },
          }}
        >
          <Add sx={{ color: palette.grays[800], mb: 1 }} />
          No Image Selected. Click To Select.
        </InputLabel>
      )}
      {uri && <img src={uri} alt="" />}
    </Box>
  )
}

export default EditorImage

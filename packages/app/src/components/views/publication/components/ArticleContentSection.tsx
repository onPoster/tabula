import { Box } from "@mui/material"
import React from "react"
import { palette } from "../../../../theme"
// import { EditableBlock } from "../../../commons/EditableBlock"
import Editor from "../../../commons/Editor/Editor"

export const ArticleContentSection: React.FC = React.memo(() => {
  return (
    <Box
      sx={{
        "& [contenteditable='true']:focus-visible": {
          outline: "none",
        },
        "& [contenteditable]:empty:after": {
          content: "attr(placeholder)",
          color: palette.grays[600],
        },
      }}
    >
      <Box className="editor">
        {/* <EditableBlock /> */}
        <Editor />
      </Box>
    </Box>
  )
})

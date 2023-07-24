import { ContentBlock, EditorBlock, EditorState, SelectionState } from "draft-js"
import EditorRichText from "./EditorRichText"
import { Box, Typography } from "@mui/material"
import { useArticleContext } from "../../../services/publications/contexts"
import React from "react"
import { palette } from "../../../theme"

interface EditorBlockItemProps {
  block: ContentBlock
  blockProps: {
    editorState: EditorState
    onDelete: () => void
    onAdd: () => void
    toggleBlockType: (blockType: string) => void
    isFocused: boolean
  }
  selection: SelectionState
}

const EditorBlockItem: React.FC<EditorBlockItemProps> = (props) => {
  const { showBlockTypePopup } = useArticleContext()
  const selectedBlockKey = props.selection.getAnchorKey()
  const isBlockFocused = props.block.getKey() === selectedBlockKey
  const isEmpty = props.block.getText().length === 0
  const isFocused = props.blockProps.isFocused
  const type = props.block.getType()

  const handleTop = (): number => {
    switch (type) {
      case "header-one":
        return 12
      case "header-two":
        return 2
      case "header-three":
        return 10
      case "header-four":
        return 6
      case "header-five":
        return 4
      case "header-six":
        return 2
      default:
        return 0
    }
  }
  return (
    <Box
      sx={{
        position: "relative",
        cursor: "text",
        mt: type.includes("code-block") ? 0 : 1,

        "&:hover .rich-text": {
          opacity: 1,
        },
      }}
    >
      {isBlockFocused && isEmpty && isFocused && (
        <Typography
          variant="body1"
          className="rich-editor-placeholder"
          sx={{
            position: "absolute",
            top: handleTop,
            left: type.includes("ordered-list-item" || "unordered-list-item") ? 30 : 0,
            color: type.includes("code-block") ? palette.whites[600] : palette.grays[600],
          }}
        >
          Type '/' for commands...
        </Typography>
      )}
      {isBlockFocused && (
        <Box
          className="rich-text"
          sx={{ opacity: 0, position: "absolute", right: "100%", top: "50%", transform: "translateY(-50%)", pr: 1 }}
        >
          <EditorRichText
            showCommand={showBlockTypePopup}
            onDelete={() => props.blockProps.onDelete()}
            onAdd={() => props.blockProps.onAdd()}
            onRichTextSelected={(value) => props.blockProps.toggleBlockType(value)}
          />
        </Box>
      )}
      <EditorBlock {...props} />
    </Box>
  )
}

export default EditorBlockItem

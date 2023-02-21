import { Box } from "@mui/material"
import React, { useEffect, useState } from "react"
import { palette } from "../../../../theme"
import { EditableBlock } from "../../../commons/EditableBlock"
import { Block } from "../../../commons/EditableItemBlock"
import { convertToBlock } from "../../../../utils/markdown"
import { usePublicationContext } from "../../../../services/publications/contexts"

export const ArticleContentSection: React.FC = () => {
  const { markdownArticle } = usePublicationContext()
  const [blocks, setBlocks] = useState<Block[]>([])

  useEffect(() => {
    if (markdownArticle) {
      const articleHashedBlock = convertToBlock(markdownArticle)
      if (articleHashedBlock.length) {
        setBlocks(articleHashedBlock)
      }
    }
  }, [markdownArticle])

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
        <EditableBlock blocks={blocks} />
      </Box>
    </Box>
  )
}

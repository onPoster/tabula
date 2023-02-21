import React, { Fragment, useEffect, useState } from "react"
import { usePublicationContext } from "../../../../services/publications/contexts"

import { EditableBlock } from "../../../commons/EditableBlock"
import { Block } from "../../../commons/EditableItemBlock"
import { convertToBlock } from "../../../../utils/markdown"

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
    <Fragment>
      <EditableBlock blocks={blocks} />
    </Fragment>
  )
}

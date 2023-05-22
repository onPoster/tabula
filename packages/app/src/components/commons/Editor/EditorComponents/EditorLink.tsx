import { Link } from "@mui/material"
import { ContentState } from "draft-js"
import React from "react"

const EditorLink: React.FC<{ contentState: ContentState; children: React.ReactNode; entityKey: string }> = (props) => {
  const { url } = props.contentState.getEntity(props.entityKey).getData()
  return (
    <Link href={url} target="_blank">
      {props.children}
    </Link>
  )
}
export default EditorLink

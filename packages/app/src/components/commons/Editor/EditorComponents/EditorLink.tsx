import { Link } from "@mui/material"
import React from "react"

const EditorLink: React.FC<{ children: React.ReactNode; url: string }> = (props) => {
  const { url } = props
  return (
    <Link href={url} target="_blank">
      {props.children}
    </Link>
  )
}
export default EditorLink

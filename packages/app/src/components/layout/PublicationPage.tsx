import React from "react"
import { Box } from "@mui/material"
import PublicationHeader from "./PublicationHeader"
import { Publications } from "../../models/publication"

type Props = {
  publication?: Publications
  showCreatePost?: boolean
}

const PublicationPage: React.FC<Props> = ({ children, publication, showCreatePost }) => {
  return (
    <>
      <PublicationHeader publication={publication} showCreatePost={showCreatePost} />
      <Box component="main" sx={{ pb: 12 }}>
        {children}
      </Box>
    </>
  )
}

export default PublicationPage

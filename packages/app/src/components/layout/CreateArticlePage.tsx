import React, { useState } from "react"
import { Box, Stack } from "@mui/material"
import ArticleHeader from "./ArticleHeader"
import ArticleSidebar from "../views/publication/components/ArticleSidebar"
import { Publications } from "../../models/publication"
import { Helmet } from "react-helmet"
import { useDynamicFavIcon } from "../../hooks/useDynamicFavIco"
import usePublication from "../../services/publications/hooks/usePublication"

type Props = {
  publication?: Publications
  showCreatePost?: boolean
  children: React.ReactNode
}

const PublicationPage: React.FC<Props> = ({ children, publication, showCreatePost }) => {
  const [showSidebar, setShowSidebar] = useState(true)

  const { imageSrc } = usePublication(publication?.id || "")

  useDynamicFavIcon(imageSrc)
  return (
    <>
      <Helmet>
        <title>{publication?.title}</title>
        <meta property="og:title" content={publication?.title} />
        {publication?.description != null && [
          <meta property="og:description" content={publication?.description} key="1" />,
          <meta name="description" content={publication?.description} key="2" />,
        ]}
        <meta property="og:url" content={`https://tabula.gg/#/${publication?.id}`} />
      </Helmet>

      <Box component="main" sx={{ p: 4 }}>
        <Stack direction="row" spacing={4}>
          <Box sx={{ display: "flex", flexGrow: 1 }}>
            <Box width="100%">
              <ArticleHeader publication={publication} setShowSidebar={setShowSidebar} showSidebar={showSidebar} />
              {children}
            </Box>
          </Box>
          {showSidebar && <ArticleSidebar setShowSidebar={setShowSidebar} />}
        </Stack>
      </Box>
    </>
  )
}

export default PublicationPage

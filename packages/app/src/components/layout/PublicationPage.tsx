import React from "react"
import { Box } from "@mui/material"
import PublicationHeader from "./PublicationHeader"
import { Publications } from "../../models/publication"
import { Helmet } from "react-helmet"
import { useDynamicFavIcon } from "../../hooks/useDynamicFavIco"
import usePublication from "../../services/publications/hooks/usePublication"
import { useParams } from "react-router-dom"

type Props = {
  articleId?: string
  publication?: Publications
  showCreatePost?: boolean
  showEditButton?: boolean
  children: React.ReactNode
}

const PublicationPage: React.FC<Props> = ({ children, publication, showCreatePost, showEditButton, articleId }) => {
  const { publicationSlug } = useParams<{ publicationSlug: string }>()
  const { imageSrc } = usePublication(publicationSlug || "")
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
      <PublicationHeader
        publication={publication}
        showCreatePost={showCreatePost}
        showEditButton={showEditButton}
        articleId={articleId}
      />
      <Box component="main" sx={{ pb: 12 }}>
        {children}
      </Box>
    </>
  )
}

export default PublicationPage

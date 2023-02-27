/* eslint-disable react-hooks/exhaustive-deps */
import { Chip, CircularProgress, Divider, Grid, Typography } from "@mui/material"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import { useParams } from "react-router-dom"
import { usePublicationContext } from "../../../services/publications/contexts"
import useArticle from "../../../services/publications/hooks/useArticle"
import { palette, typography } from "../../../theme"
import { Markdown } from "../../commons/Markdown"
import { ViewContainer } from "../../commons/ViewContainer"
import PublicationPage from "../../layout/PublicationPage"
import isIPFS from "is-ipfs"
// import { WalletBadge } from "../../commons/WalletBadge"
import { useDynamicFavIcon } from "../../../hooks/useDynamicFavIco"
import usePublication from "../../../services/publications/hooks/usePublication"
import TurndownService from "turndown"

interface ArticleViewProps {
  updateChainId: (chainId: number) => void
}

export const ArticleView: React.FC<ArticleViewProps> = ({ updateChainId }) => {
  const turndownService = new TurndownService()
  const { articleId } = useParams<{ articleId: string }>()
  const { article, saveArticle, getIpfsData, markdownArticle, setMarkdownArticle, loading } = usePublicationContext()
  const { data, executeQuery, imageSrc } = useArticle(articleId || "")
  const publication = usePublication(article?.publication?.id || "")
  useDynamicFavIcon(publication.imageSrc)
  const date = article && article.lastUpdated && new Date(parseInt(article.lastUpdated) * 1000)
  const isValidHash = article && isIPFS.multihash(article.article)
  const [articleToShow, setArticleToShow] = useState<string>("")
  useEffect(() => {
    if (publication.chainId != null) {
      updateChainId(publication.chainId)
    }
  }, [publication, updateChainId])

  useEffect(() => {
    if (!article && articleId) {
      executeQuery()
    }
  }, [articleId, article, executeQuery])

  useEffect(() => {
    if (!article && data) {
      saveArticle(data)
    }
  }, [data, article, saveArticle])

  useEffect(() => {
    if (article) {
      if (isValidHash && article && !markdownArticle) {
        getIpfsData(article.article)
        return
      }
      if (!isValidHash && article) {
        const markdown = turndownService.turndown(article.article)
        console.log("markdown", markdown)
        setArticleToShow(markdown)
      }
    }
  }, [isValidHash, article, markdownArticle, getIpfsData])

  useEffect(() => {
    if (markdownArticle) {
      const markdown = turndownService.turndown(markdownArticle)
      console.log("markdownArticle", markdown)
      setArticleToShow(markdown)
    }
  }, [markdownArticle])

  useEffect(() => {
    return () => {
      setMarkdownArticle(undefined)
    }
  }, [setMarkdownArticle])

  return (
    <PublicationPage showCreatePost={false} showEditButton={true} publication={article?.publication}>
      {loading ? (
        <Grid container justifyContent="center" alignItems="center" my={2}>
          <CircularProgress color="primary" size={50} sx={{ marginRight: 1, color: palette.primary[1000] }} />
        </Grid>
      ) : (
        <ViewContainer maxWidth="sm">
          {article && (
            <Grid container mt={10} flexDirection="column">
              <Helmet>
                <title>
                  {article.title} | {article.publication?.title}
                </title>
                <meta property="og:title" content={article.title} />
                <meta property="og:site_name" content={article.publication?.title} />
                {article?.description != null && [
                  <meta property="og:description" content={article?.description} key="1" />,
                  <meta name="description" content={article?.description} key="2" />,
                ]}
                <meta property="og:url" content={`https://tabula.gg/#/${article.publication?.id}/${article.id}`} />
                {article.image != null && <meta property="og:image" content={imageSrc} />}
              </Helmet>
              {article.image && <img src={imageSrc} alt={article.title} />}
              <Grid item>
                <Typography variant="h1">{article.title}</Typography>
              </Grid>

              {/* {article.authors?.length && (
                <Grid container alignItems="center" gap={2} my={1}>
                  {article.authors.map((author) => (
                    <Grid item key={author}>
                      <WalletBadge address={author} copyable />
                    </Grid>
                  ))}
                </Grid>
              )} */}
              {article.publication && (
                <Grid container spacing={1} sx={{ marginLeft: -0.5 }}>
                  {article.tags &&
                    article.tags.length > 0 &&
                    article.tags.map((tag, index) => (
                      <Grid item key={index}>
                        <Chip sx={{ height: "100%" }} label={tag} size="small" />
                      </Grid>
                    ))}
                </Grid>
              )}
              <Grid item my={5} width="100%">
                <Markdown>{articleToShow}</Markdown>
              </Grid>

              <Divider />

              <Grid item mt={2}>
                <Typography variant="body1" fontFamily={typography.fontFamilies.sans}>
                  Article was updated on: {moment(date).format("MMMM DD, YYYY")}
                </Typography>
              </Grid>
            </Grid>
          )}
        </ViewContainer>
      )}
    </PublicationPage>
  )
}

import { Box, Chip, CircularProgress, Divider, Grid, Typography } from "@mui/material"
import moment from "moment"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Helmet } from "react-helmet"
import { useParams } from "react-router-dom"
import { useArticleContext } from "@/services/publications/contexts"
import useArticle from "@/services/publications/hooks/useArticle"
import { palette, typography } from "@/theme"
import { ViewContainer } from "@/components/commons/ViewContainer"
import PublicationPage from "@/components/layout/PublicationPage"
import isIPFS from "is-ipfs"
import { useDynamicFavIcon } from "@/hooks/useDynamicFavIco"
import usePublication from "@/services/publications/hooks/usePublication"
import { HtmlRenderer } from "@/components/commons/HtmlRender"
import { addUrlToImageHashes } from "@/services/publications/utils/article-method"
import { useIPFSContext } from "@/services/ipfs/context"

interface ArticleViewProps {}
export const ArticleView: React.FC<ArticleViewProps> = () => {
  const { publicationSlug } = useParams<{ publicationSlug: string }>()
  const { articleId } = useParams<{ articleId: string }>()
  const { decodeIpfsHash } = useIPFSContext()
  const { article, saveArticle, loading } = useArticleContext()
  const { data, executeQuery, imageSrc } = useArticle(articleId || "")
  const publication = usePublication(publicationSlug || "")

  useDynamicFavIcon(publication?.imageSrc)
  const date = useMemo(
    () => article?.lastUpdated && new Date(parseInt(article.lastUpdated) * 1000),
    [article?.lastUpdated],
  )

  const isValidHash = useMemo(() => article && isIPFS.multihash(article.article), [article])

  const [articleToShow, setArticleToShow] = useState<string>("")
  const [attempt, setAttempt] = useState(0)

  const fetchArticleToShow = useCallback(() => {
    if (article && !articleToShow) {
      if (isValidHash) {
        const decode = async () => {
          const post = await decodeIpfsHash(article.article)
          setArticleToShow(addUrlToImageHashes(post))
        }
        decode()
      } else {
        setArticleToShow(addUrlToImageHashes(article.article))
      }
    }
  }, [article, articleToShow, decodeIpfsHash, isValidHash])
  
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
    if (article && !articleToShow && attempt < 5) {
      const timer = setTimeout(() => {
        fetchArticleToShow()
        setAttempt(attempt + 1)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [article, articleToShow, attempt, fetchArticleToShow])

  return (
    <PublicationPage
      showCreatePost={false}
      showEditButton={true}
      publication={article?.publication}
      articleId={article?.id}
    >
      {loading ? (
        <Grid container justifyContent="center" alignItems="center" my={2}>
          <CircularProgress color="primary" size={50} sx={{ marginRight: 1, color: palette.primary[1000] }} />
        </Grid>
      ) : (
        <ViewContainer maxWidth="sm" sx={{ "& *": { overflowWrap: "break-word", whiteSpace: "pre-wrap" } }}>
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
                <meta property="og:url" content={`https://tabula.gg/#/${publicationSlug}/${article.id}`} />
                {article.image != null && <meta property="og:image" content={imageSrc} />}
              </Helmet>
              {article.image && <img src={imageSrc} alt={article.title} />}
              <Grid item>
                <Typography variant="h1">{article.title}</Typography>
              </Grid>

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
              <Grid item my={5} width="100%" sx={{ wordBreak: "break-word" }}>
                {!articleToShow && (
                  <Box display={"flex"} alignItems={"center"}>
                    <CircularProgress color="primary" size={25} sx={{ marginRight: 1, color: palette.primary[1000] }} />
                    <Typography>Decoding article...</Typography>
                  </Box>
                )}
                {articleToShow && <HtmlRenderer htmlContent={articleToShow} />}
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

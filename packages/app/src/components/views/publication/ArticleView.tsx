import { Avatar, CircularProgress, Divider, Grid, Chip, Stack, Typography } from "@mui/material"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import { useNavigate, useParams } from "react-router-dom"
import { usePublicationContext } from "../../../services/publications/contexts"
import useArticle from "../../../services/publications/hooks/useArticle"
import { palette, typography } from "../../../theme"
import { Markdown } from "../../commons/Markdown"
import { ViewContainer } from "../../commons/ViewContainer"
import PublicationPage from "../../layout/PublicationPage"
import isIPFS from "is-ipfs"

export const ArticleView: React.FC = () => {
  const navigate = useNavigate()
  const { articleId } = useParams<{ articleId: string }>()
  const { article, saveArticle, getPinnedData, markdownArticle, setMarkdownArticle, loading } = usePublicationContext()
  const { data, executeQuery } = useArticle(articleId || "")
  const date = article && article.lastUpdated && new Date(parseInt(article.lastUpdated) * 1000)
  const isValidHash = article && isIPFS.multihash(article.article)
  const [articleToShow, setArticleToShow] = useState<string>("")

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
        getPinnedData(article.article)
        return
      }
      if (!isValidHash && article) {
        setArticleToShow(article.article)
      }
    }
  }, [isValidHash, article, markdownArticle, getPinnedData])

  useEffect(() => {
    if (markdownArticle) {
      setArticleToShow(markdownArticle)
    }
  }, [markdownArticle])

  useEffect(() => {
    return () => {
      setMarkdownArticle(undefined)
    }
  }, [setMarkdownArticle])

  return (
    <PublicationPage showCreatePost={false} publication={article?.publication}>
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
                <meta
                  property="og:url"
                  content={`https://tabula.gg/#/publication/${article.publication?.id}/article/${article.id}`}
                />
                {article.image != null && (
                  <meta property="og:image" content={`https://ipfs.infura.io/ipfs/${article?.image}`} />
                )}
              </Helmet>
              <Grid item>
                <Typography variant="h1" fontFamily={typography.fontFamilies.sans}>
                  {article.title}
                </Typography>
              </Grid>

              {article.publication && (
                <Stack alignItems="center" direction="row" spacing={2} sx={{ mt: 3 }}>
                  <Stack
                    alignItems="center"
                    direction="row"
                    spacing={1}
                    sx={{
                      cursor: "pointer",
                      transition: "opacity 0.25s ease-in-out",
                      "&:hover": {
                        opacity: 0.6,
                      },
                    }}
                    onClick={() => navigate(`/publication/post/${article.publication?.id}`)}
                  >
                    <Avatar
                      sx={{ width: 31, height: 31 }}
                      src={
                        article.publication?.image ? `https://ipfs.infura.io/ipfs/${article?.publication.image}` : ""
                      }
                    >
                      {" "}
                    </Avatar>
                    <Typography variant="subtitle2" fontWeight={600} fontFamily={typography.fontFamilies.sans}>
                      {article.publication?.title}
                    </Typography>
                  </Stack>
                  {date && <Typography>{moment(date).format("MMMM DD, YYYY")}</Typography>}
                  <Stack alignItems="center" direction="row" spacing={1}>
                    {article.tags &&
                      article.tags.length > 0 &&
                      article.tags.map((tag, index) => <Chip label={tag} size="small" key={index} />)}
                  </Stack>
                </Stack>
              )}
              <Grid item my={10}>
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

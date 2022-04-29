import { Avatar, Divider, Grid, Typography } from "@mui/material"
import moment from "moment"
import React, { useEffect } from "react"
import { Helmet } from "react-helmet"
import { useNavigate, useParams } from "react-router-dom"
import { usePublicationContext } from "../../../services/publications/contexts"
import useArticle from "../../../services/publications/hooks/useArticle"
import { typography } from "../../../theme"
import { Markdown } from "../../commons/Markdown"
import { ViewContainer } from "../../commons/ViewContainer"
import PublicationPage from "../../layout/PublicationPage"

export const ArticleView: React.FC = () => {
  const navigate = useNavigate()
  const { articleId } = useParams<{ articleId: string }>()
  const { article, saveArticle } = usePublicationContext()
  const { data, executeQuery } = useArticle(articleId || "")
  const date = article && article.lastUpdated && new Date(parseInt(article.lastUpdated) * 1000)

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

  return (
    <PublicationPage showCreatePost={false} publication={article?.publication}>
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
              <Grid item onClick={() => navigate(`/publication/post/${article.publication?.id}`)}>
                <Grid container alignItems="center" gap={2} mt={3} sx={{ cursor: "pointer" }}>
                  <Grid item>
                    <Avatar
                      sx={{ width: 31, height: 31 }}
                      src={
                        article.publication?.image ? `https://ipfs.infura.io/ipfs/${article?.publication.image}` : ""
                      }
                    >
                      {" "}
                    </Avatar>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2" fontWeight={600} fontFamily={typography.fontFamilies.sans}>
                      {article.publication?.title}
                    </Typography>
                  </Grid>
                  <Grid item>{date && <Typography>{moment(date).format("MMMM DD, YYYY")}</Typography>}</Grid>
                </Grid>
              </Grid>
            )}

            <Grid item my={10}>
              <Markdown>{article.article}</Markdown>
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
    </PublicationPage>
  )
}

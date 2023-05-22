/* eslint-disable react-hooks/exhaustive-deps */
import { Chip, CircularProgress, Divider, Grid, Typography } from "@mui/material"
import moment from "moment"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Helmet } from "react-helmet"
import { useParams } from "react-router-dom"
import { useArticleContext } from "../../../services/publications/contexts"
import useArticle from "../../../services/publications/hooks/useArticle"
import { palette, typography } from "../../../theme"
import { Markdown } from "../../commons/Markdown"
import { ViewContainer } from "../../commons/ViewContainer"
import PublicationPage from "../../layout/PublicationPage"
import isIPFS from "is-ipfs"
import { useDynamicFavIcon } from "../../../hooks/useDynamicFavIco"
import usePublication from "../../../services/publications/hooks/usePublication"
import { convertToMarkdown } from "../../../utils/string-handler"

interface ArticleViewProps {
  updateChainId: (chainId: number) => void
}
//Provisional solution to detect older articles and check the dif between markdown and html articles
const VALIDATION_DATE = "2023-02-02T00:00:00Z"
export const ArticleView: React.FC<ArticleViewProps> = ({ updateChainId }) => {
  const { publicationSlug } = useParams<{ publicationSlug: string }>()
  const { articleId } = useParams<{ articleId: string }>()
  const { article, saveArticle, markdownArticle, setMarkdownArticle, loading, getIpfsData, setArticleEditorState, saveDraftArticle } = useArticleContext()
  const { data, executeQuery, imageSrc } = useArticle(articleId || "")
  const publication = usePublication(publicationSlug || "")
  useDynamicFavIcon(publication?.imageSrc)
  const dateCreation = useMemo(
    () => article?.postedOn && new Date(parseInt(article.postedOn) * 1000),
    [article?.postedOn],
  )
  const date = useMemo(
    () => article?.lastUpdated && new Date(parseInt(article.lastUpdated) * 1000),
    [article?.lastUpdated],
  )
  const isAfterHtmlImplementation = useMemo(() => moment(dateCreation).isAfter(VALIDATION_DATE), [dateCreation])
  const isValidHash = useMemo(() => article && isIPFS.multihash(article.article), [article?.article])

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

  const fetchArticleContent = useCallback(async () => {
    if (isValidHash && article && !markdownArticle) {
      await getIpfsData(article.article)
      return
    }
    if (!isValidHash && article) {
      if (!isAfterHtmlImplementation) {
        return setArticleToShow(article.article)
      }
      const markdownContent = convertToMarkdown(article.article)
      setArticleToShow(markdownContent)
    }
  }, [isValidHash, article, markdownArticle, getIpfsData, isAfterHtmlImplementation])

  useEffect(() => {
    if (article) {
      saveDraftArticle(article)
      fetchArticleContent()
    }
  }, [article, fetchArticleContent])

  useEffect(() => {
    if (markdownArticle) {
      setArticleEditorState(markdownArticle)
      const markdownContent = convertToMarkdown(markdownArticle)
      setArticleToShow(markdownContent)
    }
  }, [markdownArticle])

  useEffect(() => {
    return () => {
      setMarkdownArticle(undefined)
    }
  }, [setMarkdownArticle])

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
        <ViewContainer maxWidth="sm" sx={{ "& *": { overflowWrap: "break-word" } }}>
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

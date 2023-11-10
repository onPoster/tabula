import React, { useEffect } from "react"
import { Box, Button, Grid, Typography } from "@mui/material"
import { palette, typography } from "../../../../theme"
import AddIcon from "@mui/icons-material/Add"
import { useNavigate, useParams } from "react-router-dom"
import { haveActionPermission } from "../../../../utils/permission"
import { useWeb3React } from "@web3-react/core"
import usePublication from "../../../../services/publications/hooks/usePublication"
import { ArticleItem } from "./ArticleItem"
import { INITIAL_ARTICLE_VALUE, useArticleContext } from "../../../../services/publications/contexts"

export const ArticlesSection: React.FC = React.memo(() => {
  const navigate = useNavigate()
  const { account } = useWeb3React()
  const { publicationSlug } = useParams<{ publicationSlug: string }>()
  const { setMarkdownArticle, saveDraftArticle, saveArticle, setDraftArticleThumbnail, setArticleEditorState } =
    useArticleContext()
  const { data, refetch, publicationId } = usePublication(publicationSlug ?? "")
  const articles = data && data.articles
  const permissions = data && data.permissions
  const havePermissionToCreate = permissions ? haveActionPermission(permissions, "articleCreate", account || "") : false
  const havePermissionToUpdate = permissions ? haveActionPermission(permissions, "articleUpdate", account || "") : false
  const havePermissionToDelete = permissions ? haveActionPermission(permissions, "articleDelete", account || "") : false

  useEffect(() => {
    if (!data && publicationId) {
      refetch()
    }
  }, [refetch, data, publicationId])

  if (articles && articles.length > 0) {
    return (
      <>
        <Grid container justifyContent="space-between" alignItems={"center"} my={4}>
          <Grid item>
            <Typography
              color={palette.grays[1000]}
              variant="h5"
              fontFamily={typography.fontFamilies.sans}
              sx={{ margin: 0 }}
            >
              Articles
            </Typography>
          </Grid>
          {havePermissionToCreate && (
            <Grid item>
              <Button
                variant="contained"
                size="medium"
                onClick={() => {
                  navigate(`./new`)
                  setMarkdownArticle(undefined)
                  setArticleEditorState(undefined)
                  saveDraftArticle(INITIAL_ARTICLE_VALUE)
                  saveArticle(undefined)
                  setDraftArticleThumbnail(undefined)
                }}
              >
                <AddIcon style={{ marginRight: 13 }} />
                New Article
              </Button>
            </Grid>
          )}
        </Grid>
        <Grid container flexDirection="column" alignItems="flex-start" justifyContent={"flex-start"} gap={4}>
          {articles &&
            articles.map((article) => (
              <Grid item sx={{ width: "100%" }} key={article.id || ""}>
                <ArticleItem
                  article={article}
                  couldUpdate={havePermissionToUpdate}
                  couldDelete={havePermissionToDelete}
                  publicationSlug={publicationSlug || ""}
                />
              </Grid>
            ))}
        </Grid>
      </>
    )
  }

  return (
    <Box
      sx={{
        alignItems: "center",
        borderRadius: 2,
        bgcolor: palette.grays[100],
        color: palette.grays[800],
        display: "flex",
        fontFamily: typography.fontFamilies.sans,
        justifyContent: "space-between",
        my: 4,
        p: 4,
        width: "100%",
      }}
    >
      There are currently no articles for this publication. Create one now.
      <Button
        variant="contained"
        size="medium"
        onClick={() => {
          navigate(`./new`)
          setMarkdownArticle(undefined)
          setArticleEditorState(undefined)
          saveDraftArticle(INITIAL_ARTICLE_VALUE)
          saveArticle(undefined)
          setDraftArticleThumbnail(undefined)
        }}
      >
        <AddIcon style={{ marginRight: 13 }} />
        New Article
      </Button>
    </Box>
  )
})

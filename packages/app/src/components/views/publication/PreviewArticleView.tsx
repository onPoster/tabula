import React, { Fragment, useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { Box, Chip, Grid, Typography } from "@mui/material"
import CreateArticlePage from "@/components/layout/CreateArticlePage"
import { useArticleContext, usePublicationContext } from "@/services/publications/contexts"
import { ViewContainer } from "@/components/commons/ViewContainer"
import { HtmlRenderer } from "@/components/commons/HtmlRender"
import { toBase64 } from "@/utils/string-handler"

const PreviewArticleView: React.FC = () => {
  const location = useLocation()

  const { publication } = usePublicationContext()
  const { articleFormMethods } = useArticleContext()
  const [thumbnailUri, setThumbnailUri] = useState<string | undefined>(undefined)
  const { getValues, watch } = articleFormMethods
  const title = getValues("title")
  const articleHtml = getValues("article")
  const tags = watch("tags")
  const thumbnail = getValues("image")
  const isEdit = location.pathname.includes("edit") && "edit"
  const isNew = location.pathname.includes("new") && "new"

  useEffect(() => {
    const transformImg = async () => {
      if (typeof thumbnail === "string") {
        setThumbnailUri(`https://ipfs.io/ipfs/${thumbnail}`)
      }
      if (thumbnail) {
        const base64Image = await toBase64(thumbnail)
        setThumbnailUri(base64Image)
      } else {
        setThumbnailUri(undefined)
      }
    }

    transformImg()
  }, [thumbnail])

  return (
    <CreateArticlePage publication={publication} type={(isEdit || isNew) as "edit" | "new"}>
      <Box
        component="form"
        sx={{ position: "relative", overflowY: "auto", overflowX: "hidden", width: "100%", height: "100vh" }}
      >
        <ViewContainer maxWidth="sm">
          <Grid container mt={10} flexDirection="column">
            {thumbnailUri && <Box component="img" sx={{ borderRadius: 1 }} alt="thumbnail image" src={thumbnailUri} />}

            <Fragment>
              <Grid item>
                <Typography variant="h1">{title}</Typography>
              </Grid>
              <Grid item>
                <Grid container spacing={1} sx={{ marginLeft: -0.5 }}>
                  {tags &&
                    tags.length > 0 &&
                    tags.map((tag: { label: string; value: string } | string, index: number) => (
                      <Grid item key={index}>
                        <Chip sx={{ height: "100%" }} label={typeof tag === "string" ? tag : tag.label} size="small" />
                      </Grid>
                    ))}
                </Grid>
              </Grid>
              <Grid item my={5} width="100%" sx={{ wordBreak: "break-word" }}>
                {articleHtml && <HtmlRenderer htmlContent={articleHtml} />}
              </Grid>
            </Fragment>
          </Grid>
        </ViewContainer>
      </Box>
    </CreateArticlePage>
  )
}

export default PreviewArticleView

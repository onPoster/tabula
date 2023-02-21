/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, SetStateAction, useEffect } from "react"
import { Box, InputLabel, InputAdornment, Stack, TextField, Typography, useTheme } from "@mui/material"
import { usePublicationContext } from "../../../../services/publications/contexts"
import { Close } from "@mui/icons-material"
import { palette, typography } from "../../../../theme"
import { UploadFile } from "../../../commons/UploadFile"
import LinkIcon from "../../../../assets/images/icons/link"
import { CreatableSelect } from "../../../commons/CreatableSelect"
import { CreateSelectOption } from "../../../../models/dropdown"

export interface ArticleSidebarProps {
  showSidebar: boolean
  setShowSidebar: React.Dispatch<SetStateAction<boolean>>
}

const ArticleSidebar: React.FC<ArticleSidebarProps> = ({ showSidebar, setShowSidebar }) => {
  const { article, draftArticle, saveDraftArticle, setDraftArticleThumbnail } = usePublicationContext()
  const [articleThumbnail, setArticleThumbnail] = useState<File>()
  const [uriImage, setUriImage] = useState<string | undefined>(undefined)
  const [postUrl, setPostUrl] = useState<string | undefined>("this-is-a-test")
  const [description, setDescription] = useState<string | undefined>(undefined)
  const [tags, setTags] = useState<string[]>([])

  const theme = useTheme()

  useEffect(() => {
    if (article) {
      if (article.description) setDescription(article.description)
      if (article.tags && article.tags.length) setTags(article.tags)
    }
  }, [article])

  useEffect(() => {
    if (draftArticle) {
      saveDraftArticle({ ...draftArticle, tags: tags ?? [] })
    }
  }, [tags])

  useEffect(() => {
    if (draftArticle && uriImage) {
      setDraftArticleThumbnail(articleThumbnail)
      saveDraftArticle({ ...draftArticle, image: uriImage })
    }
  }, [uriImage])

  const handleClose = () => {
    setShowSidebar(false)
  }

  const handleTags = (items: CreateSelectOption[]) => {
    if (items.length) {
      const newTags = items.map((item) => item.value)
      setTags(newTags)
    } else {
      setTags([])
    }
  }

  const edited = true

  return (
    <Box
      sx={{
        pl: 3,
        transform: `translate(0%)`,
        width: 320,
        position: "relative",
        "&:before": {
          content: `""`,
          width: "1px",
          bgcolor: palette.grays[200],
          left: 0,
          height: `calc(100vh - ${theme.spacing(4 * 2)})`,
          mt: 4,
          position: "absolute",
        },
      }}
    >
      <Stack>
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            borderBottom: `1px solid ${palette.grays[200]}`,
            justifyContent: "space-between",
            pb: 3,
            mt: 5,
            mr: 3,
          }}
        >
          <Typography variant="h6" fontFamily={typography.fontFamilies.sans} lineHeight="1.5" mt={0}>
            Article Settings
          </Typography>
          <Close
            sx={{ color: palette.grays[1000], cursor: "pointer", "&:hover": { color: palette.grays[400] } }}
            onClick={handleClose}
          />
        </Stack>

        <Stack
          spacing={5}
          sx={{
            maxHeight: `calc(100vh - ${theme.spacing(12)})`,
            overflowY: "scroll",
            py: 4,
            pr: 3,
          }}
        >
          {/* Thumbnail */}
          <Stack spacing={1}>
            <InputLabel>Thumbnail</InputLabel>
            <UploadFile
              defaultImage={article?.image}
              onFileSelected={setArticleThumbnail}
              convertedFile={setUriImage}
            />
          </Stack>

          {/* Post URL */}
          <Stack spacing={1}>
            <InputLabel>Post URL</InputLabel>
            <Stack spacing={0.5}>
              <TextField
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LinkIcon />
                    </InputAdornment>
                  ),
                  sx: {
                    color: edited ? palette.grays[1000] : palette.grays[600],
                  },
                }}
                value={postUrl}
                onChange={(e) => setPostUrl(e.target.value)}
              />
              <Typography
                color={palette.grays[400]}
                fontSize={12}
                fontWeight={400}
                fontFamily={typography.fontFamilies.sans}
              >
                gnosis-guild.tabula.gg/{postUrl}
              </Typography>
            </Stack>
          </Stack>

          {/* Description */}
          <Stack spacing={1}>
            <InputLabel>Description</InputLabel>
            <TextField
              multiline
              minRows={4}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                draftArticle && saveDraftArticle({ ...draftArticle, description: e.target.value })
              }}
            />
          </Stack>

          {/* Tags */}
          <Stack spacing={1}>
            <InputLabel>Tags</InputLabel>
            <CreatableSelect
              placeholder="Add a tag..."
              onSelected={handleTags}
              value={tags}
              errorMsg={tags.length && tags.length >= 6 ? "Add up to 5 tags for your article" : undefined}
            />
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}

export default ArticleSidebar

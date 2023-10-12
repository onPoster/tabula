/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, SetStateAction, useEffect, useCallback } from "react"
import { Box, InputLabel, Stack, TextField, Tooltip, Typography, useTheme } from "@mui/material"
import { useArticleContext } from "../../../../services/publications/contexts"
import { Close } from "@mui/icons-material"
import { palette, typography } from "../../../../theme"
import { UploadFile } from "../../../commons/UploadFile"
// import LinkIcon from "../../../../assets/images/icons/link"
import { CreatableSelect } from "../../../commons/CreatableSelect"
import { CreateSelectOption } from "../../../../models/dropdown"
import useDebouncedState from "../../../../hooks/useDebouncedState"
import useLocalStorage from "../../../../hooks/useLocalStorage"
import { Pinning, PinningService } from "../../../../models/pinning"

export interface ArticleSidebarProps {
  showSidebar: boolean
  setShowSidebar: React.Dispatch<SetStateAction<boolean>>
}

const ArticleSidebar: React.FC<ArticleSidebarProps> = ({ showSidebar, setShowSidebar }) => {
  const [pinning] = useLocalStorage<Pinning | undefined>("pinning", undefined)
  const isDirectlyOnChain = pinning && pinning.service === PinningService.NONE
  const { article } = useArticleContext()
  const { draftArticle, saveDraftArticle, setDraftArticleThumbnail, draftArticleThumbnail, updateDraftArticle } =
    useArticleContext()
  const [articleThumbnail, setArticleThumbnail] = useState<File>()
  const [uriImage, setUriImage] = useState<string | undefined>(undefined)
  // const [postUrl, setPostUrl] = useState<string | undefined>("this-is-a-test")
  const [description, debouncedDescription, setDescription] = useDebouncedState<string>(draftArticle?.description ?? "")
  const [tags, setTags] = useState<string[]>([])
  const theme = useTheme()

  useEffect(() => {
    updateDraftArticle("description", debouncedDescription)
  }, [debouncedDescription])

  useEffect(() => {
    if (article?.tags?.length && !tags.length) {
      setTags(article.tags)
    }

    if (draftArticle && (description === "" || !tags.length)) {
      if (draftArticle.tags && draftArticle.tags.length) {
        setTags(draftArticle.tags)
      }
      if (draftArticle.image) {
        setUriImage(draftArticle.image)
      }
    }
  }, [article, draftArticle, tags.length, description])

  useEffect(() => {
    if (draftArticleThumbnail && !articleThumbnail) {
      setArticleThumbnail(draftArticleThumbnail)
    }
  }, [draftArticleThumbnail])

  useEffect(() => {
    if (draftArticle && uriImage) {
      setDraftArticleThumbnail(articleThumbnail)
      saveDraftArticle({ ...draftArticle, image: uriImage })
    }
  }, [uriImage])

  const handleClose = () => {
    setShowSidebar(false)
  }

  const handleTags = useCallback(
    (items: CreateSelectOption[]) => {
      if (items.length && draftArticle) {
        const newTags = items.map((item) => item.value)
        setTags(newTags)
        updateDraftArticle("tags", newTags)
      } else {
        setTags([])
        if (draftArticle) updateDraftArticle("tags", [])
      }
    },
    [draftArticle, updateDraftArticle],
  )

  const setHandleTags = useCallback(
    (items: CreateSelectOption[]) => {
      handleTags(items)
    },
    [handleTags],
  )

  const handleOnFiles = (file: File | undefined) => {
    setDraftArticleThumbnail(file)
    setArticleThumbnail(file)
    if (!file && draftArticle) {
      setUriImage(undefined)
      updateDraftArticle("image", null)
    }
  }

  // const edited = true

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
          <Tooltip
            title={isDirectlyOnChain ? "If you'd like to include images, you need to configure a pinning service." : ""}
          >
            <Stack spacing={1}>
              <InputLabel>Thumbnail</InputLabel>
              <UploadFile
                defaultImage={article?.image}
                defaultUri={draftArticle?.image ?? undefined}
                onFileSelected={handleOnFiles}
                convertedFile={setUriImage}
                disabled={isDirectlyOnChain}
              />
            </Stack>
          </Tooltip>

          {/* Post URL */}
          {/* <Stack spacing={1}>
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
          </Stack> */}

          {/* Description */}
          <Stack spacing={1}>
            <InputLabel>Description</InputLabel>
            <TextField multiline minRows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
          </Stack>

          {/* Tags */}
          <Stack spacing={1}>
            <InputLabel>Tags</InputLabel>
            <CreatableSelect
              placeholder="Add a tag..."
              onSelected={setHandleTags}
              value={tags}
              limit={5}
              errorMsg={tags.length && tags.length >= 6 ? "Add up to 5 tags for your article" : undefined}
            />
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}

export default ArticleSidebar

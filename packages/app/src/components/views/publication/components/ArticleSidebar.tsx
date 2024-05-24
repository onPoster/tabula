import React, { SetStateAction } from "react"
import { Box, InputLabel, Stack, TextField, Tooltip, Typography, useTheme } from "@mui/material"
import { useArticleContext } from "@/services/publications/contexts"
import { Close } from "@mui/icons-material"
import { palette, typography } from "@/theme"
import { UploadFile } from "@/components/commons/UploadFile"
// import LinkIcon from "@/assets/images/icons/link"
import { CreatableSelect } from "@/components/commons/CreatableSelect"
import useLocalStorage from "@/hooks/useLocalStorage"
import { Pinning, PinningService } from "@/models/pinning"
import { Controller } from "react-hook-form"
export interface ArticleSidebarProps {
  setShowSidebar: React.Dispatch<SetStateAction<boolean>>
}

const ArticleSidebar: React.FC<ArticleSidebarProps> = ({ setShowSidebar }) => {
  const [pinning] = useLocalStorage<Pinning | undefined>("pinning", undefined)
  const isDirectlyOnChain = pinning && pinning.service === PinningService.NONE
  const { article } = useArticleContext()
  const {
    draftArticle,
    // saveDraftArticle,
    // setDraftArticleThumbnail,
    // draftArticleThumbnail,
    // updateDraftArticle,
    articleFormMethods,
  } = useArticleContext()
  // const [articleThumbnail, setArticleThumbnail] = useState<File>()
  // const [uriImage, setUriImage] = useState<string | undefined>(undefined)
  // const [postUrl, setPostUrl] = useState<string | undefined>("this-is-a-test")

  const {
    control,
    setValue: setArticleFormValue,
    formState: { errors },
  } = articleFormMethods

  const theme = useTheme()

  // useEffect(() => {
  //   if (article?.tags?.length && !tags.length) {
  //     setTags(article.tags)
  //   }

  //   if (draftArticle && (description === "" || !tags.length)) {
  //     if (draftArticle.tags && draftArticle.tags.length) {
  //       setTags(draftArticle.tags)
  //     }
  //     if (draftArticle.image) {
  //       setUriImage(draftArticle.image)
  //     }
  //   }
  // }, [article, draftArticle, tags.length, description])

  // useEffect(() => {
  //   if (draftArticleThumbnail && !articleThumbnail) {
  //     setArticleThumbnail(draftArticleThumbnail)
  //   }
  // }, [draftArticleThumbnail])

  // useEffect(() => {
  //   if (draftArticle && uriImage) {
  //     setDraftArticleThumbnail(articleThumbnail)
  //     saveDraftArticle({ ...draftArticle, image: uriImage })
  //   }
  // }, [uriImage])

  const handleClose = () => {
    setShowSidebar(false)
  }

  // const handleOnFiles = (file: File | undefined) => {
  //   setDraftArticleThumbnail(file)
  //   setArticleThumbnail(file)
  //   if (!file && draftArticle) {
  //     setUriImage(undefined)
  //     updateDraftArticle("image", null)
  //   }
  // }

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
                onFileSelected={(fileSelected) => setArticleFormValue("image", fileSelected)}
                // convertedFile={setUriImage}
                disabled={isDirectlyOnChain}
              />
            </Stack>
          </Tooltip>

          {/* Description */}
          <Stack spacing={1}>
            <InputLabel>Description</InputLabel>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  minRows={4}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />
          </Stack>

          {/* Tags */}
          <Stack spacing={1}>
            <InputLabel>Tags</InputLabel>
            <Controller
              control={control}
              name="tags"
              render={({ field, fieldState }) => (
                <CreatableSelect
                  {...field}
                  control={control}
                  placeholder="Add up to 5 tags"
                  errorMsg={fieldState.error?.message}
                />
              )}
            />
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}

export default ArticleSidebar

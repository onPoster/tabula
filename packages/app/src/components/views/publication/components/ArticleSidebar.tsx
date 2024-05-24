import React, { SetStateAction, useEffect, useState } from "react"
import { Box, InputLabel, Stack, TextField, Tooltip, Typography, useTheme } from "@mui/material"
import { useArticleContext } from "@/services/publications/contexts"
import { Close } from "@mui/icons-material"
import { palette, typography } from "@/theme"
import { UploadFile } from "@/components/commons/UploadFile"
import { CreatableSelect } from "@/components/commons/CreatableSelect"
import useLocalStorage from "@/hooks/useLocalStorage"
import { Pinning, PinningService } from "@/models/pinning"
import { Controller } from "react-hook-form"
import { toBase64 } from "@/utils/string-handler"
export interface ArticleSidebarProps {
  setShowSidebar: React.Dispatch<SetStateAction<boolean>>
}

const ArticleSidebar: React.FC<ArticleSidebarProps> = ({ setShowSidebar }) => {
  const [pinning] = useLocalStorage<Pinning | undefined>("pinning", undefined)
  const isDirectlyOnChain = pinning && pinning.service === PinningService.NONE
  const { article } = useArticleContext()
  const { articleFormMethods } = useArticleContext()

  const {
    control,
    getValues,
    setValue: setArticleFormValue,
    formState: { errors },
  } = articleFormMethods
  const articleImage = getValues("image")
  const theme = useTheme()
  const [thumbnailUri, setThumbnailUri] = useState<string | undefined>(undefined)

  useEffect(() => {
    const transformImg = async () => {
      if (typeof articleImage === "string") {
        setThumbnailUri(`https://ipfs.io/ipfs/${articleImage}`)
      }
      if (articleImage) {
        const base64Image = await toBase64(articleImage)
        setThumbnailUri(base64Image)
      } else {
        setThumbnailUri(undefined)
      }
    }

    transformImg()
  }, [articleImage])

  const handleClose = () => {
    setShowSidebar(false)
  }

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
                defaultUri={thumbnailUri}
                onFileSelected={(fileSelected) => setArticleFormValue("image", fileSelected)}
                convertedFile={setThumbnailUri}
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

import React, { useState, SetStateAction, useEffect } from "react"
import { Box, InputLabel, InputAdornment, Stack, TextField, Typography, useTheme } from "@mui/material"
import { usePublicationContext } from "../../../../services/publications/contexts"
import { Close } from "@mui/icons-material"
import SettingsIcon from "../../../../assets/images/icons/settings"
import { palette, typography } from "../../../../theme"
import { UploadFile } from "../../../commons/UploadFile"
import LinkIcon from "../../../../assets/images/icons/link"
import { CreatableSelect } from "../../../commons/CreatableSelect"

export interface ArticleSidebarProps {
  setShowSidebar: React.Dispatch<SetStateAction<boolean>>
}

const ArticleSidebar: React.FC<ArticleSidebarProps> = ({ setShowSidebar }) => {
  const { publication, article, draftArticle, saveDraftArticle } = usePublicationContext()

  const [articleImg, setArticleImg] = useState<File | undefined>(undefined)

  const theme = useTheme()

  const handleClose = () => {
    setShowSidebar(false)
  }

  const edited = true

  return (
    <Box
      sx={{
        // "@keyframes slideIn": {
        //   "0%": {
        //     transform: "translateX(100%)",
        //   },
        //   "100%": {
        //     transform: "translateX(0%)",
        //   },
        // },
        // animation: "slideIn 1s ease-in-out forwards",
        borderLeft: `1px solid ${palette.grays[400]}`,
        minHeight: `calc(100vh - ${theme.spacing(4 * 2)})`,
        pl: 4,
        transform: `translate(0%)`,
        width: 320,
      }}
    >
      <Stack spacing={5}>
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            mt: 2,
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

        {/* Thumbnail */}
        <Stack spacing={1}>
          <InputLabel>Thumbnail</InputLabel>
          <UploadFile defaultImage={article?.image} onFileSelected={setArticleImg} />
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
              value="this-is-a-test"
            />
            <Typography
              color={palette.grays[400]}
              fontSize={12}
              fontWeight={400}
              fontFamily={typography.fontFamilies.sans}
            >
              gnosis-guild.tabula.gg/this-is-a-test
            </Typography>
          </Stack>
        </Stack>

        {/* Description */}
        <Stack spacing={1}>
          <InputLabel>Description</InputLabel>
          <TextField multiline minRows={4} />
        </Stack>

        {/* Tags */}
        <Stack spacing={1}>
          <InputLabel>Tags</InputLabel>
          <CreatableSelect
            placeholder="Add a tag..."
            // onSelected={handleTags}
            // value={tags}
            value={article?.tags}
            // errorMsg={tags.length && tags.length >= 6 ? "Add up to 5 tags for your article" : undefined}
          />
        </Stack>
      </Stack>
    </Box>
  )
}

export default ArticleSidebar

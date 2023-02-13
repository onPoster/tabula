import React, { useState, SetStateAction } from "react"
import { Box, InputLabel, InputAdornment, Stack, TextField, Typography, useTheme } from "@mui/material"
import { usePublicationContext } from "../../../../services/publications/contexts"
import { Close } from "@mui/icons-material"
import { palette, typography } from "../../../../theme"
import { UploadFile } from "../../../commons/UploadFile"
import LinkIcon from "../../../../assets/images/icons/link"
import { CreatableSelect } from "../../../commons/CreatableSelect"

export interface ArticleSidebarProps {
  showSidebar: boolean
  setShowSidebar: React.Dispatch<SetStateAction<boolean>>
}

const ArticleSidebar: React.FC<ArticleSidebarProps> = ({ showSidebar, setShowSidebar }) => {
  const { article } = usePublicationContext()

  const [articleImg, setArticleImg] = useState<File | undefined>(undefined)

  const theme = useTheme()

  const handleClose = () => {
    setShowSidebar(false)
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
      </Stack>
    </Box>
  )
}

export default ArticleSidebar

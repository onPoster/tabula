import React, { useEffect, useState, useRef } from "react"
// import { useOnClickOutside } from "../../hooks/useOnClickOutside"
import { Portal, Stack, SxProps, TextField, Theme } from "@mui/material"
import { ReactComponent as BoldIcon } from "../../../assets/images/boldIcon.svg"
import { ReactComponent as ItalicIcon } from "../../../assets/images/italicIcon.svg"
import { ReactComponent as UnderlineIcon } from "../../../assets/images/underlineIcon.svg"
import { ReactComponent as StrikethroughIcon } from "../../../assets/images/strikethroughIcon.svg"
import { ReactComponent as CodeIcon } from "../../../assets/images/codeIcon.svg"
import { ReactComponent as LinkIcon } from "../../../assets/images/linkIcon.svg"
import { EditorState } from "draft-js"

import { palette } from "../../../theme"
import { useArticleContext } from "../../../services/publications/contexts"

const inlineStyleOptions = [
  {
    slug: "BOLD",
    tag: "b",
    icon: <BoldIcon />,
  },
  {
    slug: "ITALIC",
    tag: "i",
    icon: <ItalicIcon />,
  },
  {
    slug: "UNDERLINE",
    tag: "span",
    icon: <UnderlineIcon />,
  },
  {
    slug: "STRIKETHROUGH",
    tag: "span",
    icon: <StrikethroughIcon />,
  },
  {
    slug: "CODE",
    tag: "code",
    icon: <CodeIcon />,
  },
  {
    slug: "LINK",
    tag: "a",
    icon: <LinkIcon />,
  },
]

type InlineStyleOptions = {
  slug: string
  tag: string
  icon: React.ReactNode
  sx?: SxProps
}

type InlineRichTextProps = {
  editorState: EditorState
  showCommand: boolean
  inlineEditorOffset?: any
  onClick: (slug: string) => void
}

const EditorInlineText: React.FC<InlineRichTextProps> = ({ editorState, inlineEditorOffset, showCommand, onClick }) => {
  const containerRef = useRef<Element | (() => Element | null) | null>(null)
  const ref = useRef<HTMLDivElement | null>(null)
  const { linkComponentUrl, setLinkComponentUrl } = useArticleContext()
  const [show, setShow] = useState<boolean>(false)
  const [top, setTop] = useState<number>()
  const [left, setLeft] = useState<number>()
  const validUrl = linkComponentUrl && linkComponentUrl.includes("https://")

  useEffect(() => {
    setShow(showCommand)
  }, [showCommand])

  useEffect(() => {
    if (inlineEditorOffset) {
      setTop(inlineEditorOffset.top)
      setLeft(inlineEditorOffset.left)
    }
  }, [inlineEditorOffset])

  const handleStyles = (slug: string): SxProps<Theme> => {
    let styles = {
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      p: 1,
      bgcolor: palette.grays[50],
      borderRadius: 1,
      "&:hover": {
        bgcolor: palette.grays[100],
      },
      "&.is-active": {
        bgcolor: palette.grays[400],
      },
    }
    if (slug === "LINK" && !validUrl) {
      styles = {
        ...styles,
        cursor: "default",
        bgcolor: palette.grays[400],
        "&:hover": {
          bgcolor: palette.grays[400],
        },
        "&.is-active": {
          bgcolor: palette.grays[400],
        },
      }
    }
    return styles
  }

  const handleClick = (slug: string) => {
    if (slug === "LINK" && !validUrl) {
      return
    }
    onClick(slug)
  }

  return (
    <Portal container={containerRef.current}>
      {show && (
        <Stack
          ref={ref}
          spacing={0.5}
          sx={{
            top: (top || 0) - 51,
            left: left,
            position: "absolute",
            background: palette.whites[1000],
            borderRadius: 2,
            boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.05)",
            padding: 1,
            boxSizing: "border-box",
            transform: "translateX(-50%)",
            zIndex: 999,
          }}
        >
          <TextField
            placeholder="Enter URL"
            value={linkComponentUrl}
            onChange={(e) => setLinkComponentUrl(e.target.value)}
            InputProps={{
              startAdornment: <LinkIcon style={{ opacity: 0.4, marginRight: "0.125rem" }} />,
            }}
          />

          <Stack direction="row" spacing={0.5}>
            {inlineStyleOptions.map(({ slug, icon }: InlineStyleOptions, index) => {
              return (
                <Stack key={`inline-${index}`} onClick={() => handleClick(slug)} sx={handleStyles(slug)}>
                  {icon}
                </Stack>
              )
            })}
          </Stack>
        </Stack>
      )}
    </Portal>
  )
}

export default EditorInlineText

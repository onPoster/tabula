import React, { useEffect, useLayoutEffect, useState, useRef } from "react"
// import { useOnClickOutside } from "../../hooks/useOnClickOutside"
import { Portal, Stack, SxProps, TextField } from "@mui/material"
import { ReactComponent as BoldIcon } from "../../../assets/images/boldIcon.svg"
import { ReactComponent as ItalicIcon } from "../../../assets/images/italicIcon.svg"
import { ReactComponent as UnderlineIcon } from "../../../assets/images/underlineIcon.svg"
import { ReactComponent as StrikethroughIcon } from "../../../assets/images/strikethroughIcon.svg"
import { ReactComponent as CodeIcon } from "../../../assets/images/codeIcon.svg"
import { ReactComponent as LinkIcon } from "../../../assets/images/linkIcon.svg"
import { EditorState, SelectionState } from "draft-js"

import { palette } from "../../../theme"

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
  const richTextRef = useRef<HTMLDivElement | null>(null)
  const ref = useRef<HTMLDivElement | null>(null)
  const [showLinkInput, setShowLinkInput] = useState<boolean>(false) // todo: set when url icon is toggled
  const [show, setShow] = useState<boolean>(false)
  const [top, setTop] = useState<number>()
  const [left, setLeft] = useState<number>()

  useEffect(() => {
    setShow(showCommand)
  }, [showCommand])

  useEffect(() => {
    console.log(inlineEditorOffset)
    if (inlineEditorOffset) {
      setTop(inlineEditorOffset.top)
      setLeft(inlineEditorOffset.left)
    }
  }, [inlineEditorOffset])

  // useLayoutEffect(() => {
  //   function updatePosition() {
  //     if (richTextRef.current) {
  //       const result = richTextRef.current.getBoundingClientRect()
  //       setTop(result.top + 32)
  //       setLeft(result.left - 115)
  //     }
  //   }
  //   window.addEventListener("resize", updatePosition)
  //   updatePosition()
  //   return () => window.removeEventListener("resize", updatePosition)
  // }, [])

  return (
    <Portal container={containerRef.current}>
      {show && (
        <Stack
          ref={ref}
          spacing={0.5}
          sx={{
            top: (top || 0) - (showLinkInput ? 51 : 0),
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
          {showLinkInput && (
            <TextField
              placeholder="Enter URL"
              InputProps={{
                startAdornment: <LinkIcon style={{ opacity: 0.4, marginRight: "0.125rem" }} />,
              }}
            />
          )}
          <Stack direction="row" spacing={0.5}>
            {inlineStyleOptions.map(({ slug, icon }: InlineStyleOptions, index) => {
              return (
                <Stack
                  key={`inline-${index}`}
                  onClick={() => onClick(slug)}
                  sx={{
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
                  }}
                >
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

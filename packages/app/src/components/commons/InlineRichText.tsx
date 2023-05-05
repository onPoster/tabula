import React, { useEffect, useLayoutEffect, useState, useRef } from "react"
// import { useOnClickOutside } from "../../hooks/useOnClickOutside"
import { Portal, Stack, SxProps } from "@mui/material"
import { ReactComponent as BoldIcon } from "../../assets/images/boldIcon.svg"
import { ReactComponent as ItalicIcon } from "../../assets/images/italicIcon.svg"
import { ReactComponent as UnderlineIcon } from "../../assets/images/underlineIcon.svg"
import { ReactComponent as StrikethroughIcon } from "../../assets/images/strikethroughIcon.svg"
import { ReactComponent as CodeIcon } from "../../assets/images/codeIcon.svg"
import { palette } from "../../theme"

const inlineStyleOptions = [
  {
    slug: "bold",
    tag: "b",
    icon: <BoldIcon />,
  },
  {
    slug: "italic",
    tag: "i",
    icon: <ItalicIcon />,
  },
  {
    slug: "underline",
    tag: "span",
    icon: <UnderlineIcon />,
    sx: { textDecoration: "underline" },
  },
  {
    slug: "strikethrough",
    tag: "span",
    icon: <StrikethroughIcon />,
    sx: { textDecoration: "line-through" },
  },
  {
    slug: "code",
    tag: "code",
    icon: <CodeIcon />,
    // sx: {textDecoration: "mono"},
  },
]

type InlineStyleOptions = {
  slug: string
  tag: string
  icon: React.ReactNode
  sx?: SxProps
}

type InlineRichTextProps = {
  showCommand: boolean
  inlineRichTextRef?: any
}

const InlineRichText: React.FC<InlineRichTextProps> = ({ inlineRichTextRef, showCommand }) => {
  const containerRef = useRef<Element | (() => Element | null) | null>(null)
  const richTextRef = useRef<HTMLDivElement | null>(null)
  const ref = useRef<HTMLDivElement | null>(null)

  const [show, setShow] = useState<boolean>(false)
  const [top, setTop] = useState<number>()
  const [left, setLeft] = useState<number>()

  // useOnClickOutside(ref, () => {
  //   if (show) {
  //     setShow(!show)
  //   }
  // })

  useEffect(() => {
    setShow(showCommand)
  }, [showCommand])

  useEffect(() => {
    if (richTextRef.current) {
      const result = richTextRef.current.getBoundingClientRect()
      setTop(result.top + 32)
      setLeft(result.left - 115)
    }
  }, [])

  useLayoutEffect(() => {
    function updatePosition() {
      if (richTextRef.current) {
        const result = richTextRef.current.getBoundingClientRect()
        setTop(result.top + 32)
        setLeft(result.left - 115)
      }
    }
    window.addEventListener("resize", updatePosition)
    updatePosition()
    return () => window.removeEventListener("resize", updatePosition)
  }, [])

  return (
    <Portal container={containerRef.current}>
      {show && (
        <Stack
          sx={{
            top: top,
            left: left,
            position: "absolute",
            background: palette.whites[1000],
            borderRadius: 2,
            boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.05)",
            padding: 1,
            boxSizing: "border-box",
          }}
          ref={ref}
          direction="row"
          spacing={0.5}
        >
          {inlineStyleOptions.map(({ slug, tag, icon, sx }: InlineStyleOptions) => {
            return (
              <Stack
                onClick={() => console.log(slug, tag, sx)}
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
      )}
    </Portal>
  )
}

export default InlineRichText

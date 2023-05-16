import styled from "@emotion/styled"
import { Box, Divider, Grid, Portal, Stack, Tooltip, Typography } from "@mui/material"
import React, { useEffect, useLayoutEffect, useState, useRef } from "react"
import { palette, typography } from "../../theme"
import AddIcon from "@mui/icons-material/Add"
import { ReactComponent as ParagraphIcon } from "../../assets/images/paragraphIcon.svg"
import { ReactComponent as ImageIcon } from "../../assets/images/imageIcon.svg"
// import { ReactComponent as OrderedIcon } from "../../assets/images/orderedIcon.svg"
// import { ReactComponent as UnorderedIcon } from "../../assets/images/unorderedIcon.svg"
import { ReactComponent as CodeIcon } from "../../assets/images/codeIcon.svg"
import { ReactComponent as QuoteIcon } from "../../assets/images/quoteIcon.svg"
import { ReactComponent as DividerIcon } from "../../assets/images/dividerIcon.svg"
import { ReactComponent as TrashIcon } from "../../assets/images/trashIcon.svg"
// import { useOnClickOutside } from "../../hooks/useOnClickOutside"
import { DragIndicator } from "@mui/icons-material"

const RichTextButton = styled(Box)({
  position: "relative",
  width: 24,
  height: 24,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 4,
  cursor: "pointer",
  "&:hover": {
    background: palette.grays[100],
  },
})

const RichTextContainer = styled(Box)({
  position: "absolute",
  maxWidth: 140,
  background: palette.whites[1000],
  borderRadius: 8,
  boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.05)",
  padding: 8,
  boxSizing: "border-box",
})

const RichTextItemContainer = styled(Box)({
  width: 40,
  height: 40,
  cursor: "pointer",
  background: palette.grays[50],
  borderRadius: 4,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "&:hover": {
    background: palette.grays[100],
  },
})

export enum RICH_TEXT_ELEMENTS {
  H1 = "h1",
  H2 = "h2",
  H3 = "h3",
  H4 = "h4",
  H5 = "h5",
  H6 = "h6",
  PARAGRAPH = "p",
  IMAGE = "img",
  ORDERED = "ol",
  UNORDERED = "li",
  CODE = "pre",
  QUOTE = "blockquote",
  DIVIDER = "hr",
}

type RichTextItemProps = {
  label?: string
  color?: string
  icon: React.ReactNode
}

type RichTextProps = {
  showCommand: boolean
  onRichTextSelected?: (value: string) => void
  onDelete: () => void
  onAdd: () => void
}

const HEADER_OPTIONS = [
  {
    value: RICH_TEXT_ELEMENTS.H1,
    icon: (
      <Typography variant="body1" fontWeight={600} fontFamily={typography.fontFamilies.sans}>
        H1
      </Typography>
    ),
  },
  {
    value: RICH_TEXT_ELEMENTS.H2,
    icon: (
      <Typography variant="body1" fontWeight={600} fontFamily={typography.fontFamilies.sans}>
        H2
      </Typography>
    ),
  },
  {
    value: RICH_TEXT_ELEMENTS.H3,
    icon: (
      <Typography variant="body1" fontWeight={600} fontFamily={typography.fontFamilies.sans}>
        H3
      </Typography>
    ),
  },
  {
    value: RICH_TEXT_ELEMENTS.H4,
    icon: (
      <Typography variant="body1" fontWeight={600} fontFamily={typography.fontFamilies.sans}>
        H4
      </Typography>
    ),
  },
  {
    value: RICH_TEXT_ELEMENTS.H5,
    icon: (
      <Typography variant="body1" fontWeight={600} fontFamily={typography.fontFamilies.sans}>
        H5
      </Typography>
    ),
  },
  {
    value: RICH_TEXT_ELEMENTS.H6,
    icon: (
      <Typography variant="body1" fontWeight={600} fontFamily={typography.fontFamilies.sans}>
        H6
      </Typography>
    ),
  },
]

const OPTIONS = [
  {
    value: RICH_TEXT_ELEMENTS.PARAGRAPH,
    label: "Paragraph",
    icon: <ParagraphIcon />,
  },
  {
    value: RICH_TEXT_ELEMENTS.IMAGE,
    label: "Image",
    icon: <ImageIcon />,
  },
  // {
  //   value: RICH_TEXT_ELEMENTS.ORDERED,
  //   label: "Ordered List",
  //   icon: <OrderedIcon />,
  // },
  // {
  //   value: RICH_TEXT_ELEMENTS.UNORDERED,
  //   label: "Unordered List",
  //   icon: <UnorderedIcon />,
  // },
  {
    value: RICH_TEXT_ELEMENTS.CODE,
    label: "Code Snippet",
    icon: <CodeIcon />,
  },
  {
    value: RICH_TEXT_ELEMENTS.QUOTE,
    label: "Quote",
    icon: <QuoteIcon />,
  },
  {
    value: RICH_TEXT_ELEMENTS.DIVIDER,
    label: "Divider Line",
    icon: <DividerIcon />,
  },
]

const DragTooltipContent = () => {
  return (
    <>
      <Typography
        gutterBottom={false}
        sx={{
          color: palette.whites[600],
          fontFamily: typography.fontFamilies.sans,
          lineHeight: 1.25,
        }}
      >
        <span style={{ color: "white" }}>Click</span> to Edit
      </Typography>
    </>
  )
}

const RichTextItem: React.FC<RichTextItemProps> = ({ label, icon, color }) => {
  return (
    <Grid
      container
      spacing={1}
      flexDirection="row"
      alignItems="center"
      sx={{
        cursor: "pointer",
        "&:hover": {
          "& .rich-text-icon": { backgroundColor: palette.grays[100] },
        },
      }}
    >
      <Grid item>
        <RichTextItemContainer className="rich-text-icon">{icon}</RichTextItemContainer>
      </Grid>
      {label && (
        <Grid item>
          <Typography
            color={color}
            variant="body2"
            fontWeight={600}
            fontSize={11}
            fontFamily={typography.fontFamilies.sans}
          >
            {label}
          </Typography>
        </Grid>
      )}
    </Grid>
  )
}

const RichText: React.FC<RichTextProps> = ({ onRichTextSelected, showCommand, onDelete, onAdd }) => {
  const containerRef = useRef<Element | (() => Element | null) | null>(null)
  const richTextRef = useRef<HTMLDivElement | null>(null)
  const ref = useRef<HTMLDivElement | null>(null)

  const [show, setShow] = useState<boolean>(false)
  const [top, setTop] = useState<number>()
  const [topOffset, setTopOffset] = useState<number>(32)
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
      setTop(result.top + topOffset)
      setLeft(result.left - 115)
    }
  }, [])

  useEffect(() => {
    if (richTextRef.current) {
      const result = richTextRef.current.getBoundingClientRect()
      const menuHeight = 311 // richTextRef.current.clientHeight

      if (menuHeight + 32 + result.top > window.innerHeight) {
        setTopOffset(-menuHeight - 16)
      } else {
        setTopOffset(32)
      }
      setTop(result.top + topOffset)
    }
  }, [richTextRef.current])

  useLayoutEffect(() => {
    function updatePosition() {
      if (richTextRef.current) {
        const result = richTextRef.current.getBoundingClientRect()

        setTop(result.top + topOffset)
        setLeft(result.left - 115)
      }
    }
    window.addEventListener("resize", updatePosition)
    updatePosition()
    return () => window.removeEventListener("resize", updatePosition)
  }, [])

  const handleSelection = (value: RICH_TEXT_ELEMENTS) => {
    if (onRichTextSelected) {
      onRichTextSelected(value)
      setShow(false)
    }
  }
  const handleDelete = () => {
    setShow(false)
    onDelete()
  }

  return (
    <>
      <Stack direction="row" spacing={0.5} ref={richTextRef}>
        <Tooltip
          title={
            <Typography
              gutterBottom={false}
              sx={{
                color: palette.whites[600],
                fontFamily: typography.fontFamilies.sans,
                lineHeight: 1.25,
              }}
            >
              <span style={{ color: "white" }}>Click</span> to add a new block
            </Typography>
          }
        >
          <RichTextButton onClick={onAdd}>
            <AddIcon sx={{ color: palette.grays[600] }} />
          </RichTextButton>
        </Tooltip>
        <Tooltip title={<DragTooltipContent />}>
          <RichTextButton onClick={() => setShow(!show)}>
            <DragIndicator sx={{ width: 20, color: palette.grays[600] }} />
          </RichTextButton>
        </Tooltip>
      </Stack>

      <Portal container={containerRef.current}>
        {show && (
          <RichTextContainer sx={{ top, left }} ref={ref}>
            <Stack spacing={1}>
              <Stack spacing={1} sx={{ maxHeight: 230, overflowY: "scroll" }}>
                <Grid item>
                  <Grid container flexDirection="column" spacing={0.5}>
                    <Grid item>
                      <Typography variant="body2" fontWeight={600} fontFamily={typography.fontFamilies.sans}>
                        Heading
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Grid container spacing={0.25}>
                        {HEADER_OPTIONS.map(({ icon, value }, index) => (
                          <Grid item key={`-${index}`}>
                            <div onClick={() => handleSelection(value)}>
                              <RichTextItem icon={icon} />
                            </div>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                {OPTIONS.map(({ label, icon, value }, index) => (
                  <Grid item key={`${label}-${index}`}>
                    <div onClick={() => value && handleSelection(value)}>
                      <RichTextItem label={label} icon={icon} />
                    </div>
                  </Grid>
                ))}
              </Stack>

              <Stack spacing={1} onClick={handleDelete}>
                <Divider />
                <RichTextItem color="primary" label={"Delete block"} icon={<TrashIcon />} />
              </Stack>
            </Stack>
          </RichTextContainer>
        )}
      </Portal>
    </>
  )
}

export default RichText

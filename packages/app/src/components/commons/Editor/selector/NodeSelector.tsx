import React from "react"
import { EditorInstance, useEditor } from "novel"
import Popover from "@mui/material/Popover"
import Button from "@mui/material/Button"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import Typography from "@mui/material/Typography"
import CheckIcon from "@mui/icons-material/Check"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { Box } from "@mui/material"
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered"
import FormatQuoteIcon from "@mui/icons-material/FormatQuote"
import CodeIcon from "@mui/icons-material/Code"
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft"
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted"
import ChecklistIcon from "@mui/icons-material/Checklist"
import { typography } from "@/theme"

export type SelectorItem = {
  name: string
  icon: React.ReactNode
  command: (editor: EditorInstance) => void
  isActive: (editor: EditorInstance) => boolean
}

const items: SelectorItem[] = [
  {
    name: "Text",
    icon: <FormatAlignLeftIcon />,
    command: (editor) => editor.chain().focus().clearNodes().run(),
    // I feel like there has to be a more efficient way to do this – feel free to PR if you know how!
    isActive: (editor) =>
      editor.isActive("paragraph") && !editor.isActive("bulletList") && !editor.isActive("orderedList"),
  },
  {
    name: "Heading 1",
    icon: (
      <Typography variant="body1" fontWeight={600} fontFamily={typography.fontFamilies.sans}>
        H1
      </Typography>
    ),
    command: (editor) => editor.chain().focus().clearNodes().toggleHeading({ level: 1 }).run(),
    isActive: (editor) => editor.isActive("heading", { level: 1 }),
  },
  {
    name: "Heading 2",
    icon: (
      <Typography variant="body1" fontWeight={600} fontFamily={typography.fontFamilies.sans}>
        H2
      </Typography>
    ),
    command: (editor) => editor.chain().focus().clearNodes().toggleHeading({ level: 2 }).run(),
    isActive: (editor) => editor.isActive("heading", { level: 2 }),
  },
  {
    name: "Heading 3",
    icon: (
      <Typography variant="body1" fontWeight={600} fontFamily={typography.fontFamilies.sans}>
        H3
      </Typography>
    ),
    command: (editor) => editor.chain().focus().clearNodes().toggleHeading({ level: 3 }).run(),
    isActive: (editor) => editor.isActive("heading", { level: 3 }),
  },
  // {
  //   name: "To-do List",
  //   icon: <ChecklistIcon />,
  //   command: (editor) => editor.chain().focus().clearNodes().toggleTaskList().run(),
  //   isActive: (editor) => editor.isActive("taskItem"),
  // },
  {
    name: "Bullet List",
    icon: <FormatListBulletedIcon />,
    command: (editor) => editor.chain().focus().clearNodes().toggleBulletList().run(),
    isActive: (editor) => editor.isActive("bulletList"),
  },
  {
    name: "Numbered List",
    icon: <FormatListNumberedIcon />,
    command: (editor) => editor.chain().focus().clearNodes().toggleOrderedList().run(),
    isActive: (editor) => editor.isActive("orderedList"),
  },
  {
    name: "Quote",
    icon: <FormatQuoteIcon />,
    command: (editor) => editor.chain().focus().clearNodes().toggleBlockquote().run(),
    isActive: (editor) => editor.isActive("blockquote"),
  },
  {
    name: "Code",
    icon: <CodeIcon />,
    command: (editor) => editor.chain().focus().clearNodes().toggleCodeBlock().run(),
    isActive: (editor) => editor.isActive("codeBlock"),
  },
  // Add other items as described previously...
]

const NodeSelector: React.FC<{ open: boolean; onOpenChange: (open: boolean) => void }> = ({ open, onOpenChange }) => {
  const { editor } = useEditor()
  const anchorRef = React.useRef<HTMLButtonElement>(null)
  if (!editor) return null

  const activeItem = items.filter((item) => item.isActive(editor)).pop() ?? {
    name: "Multiple",
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Button
        sx={{ fontSize: 14, whiteSpace: "nowrap" }}
        ref={anchorRef}
        onClick={() => onOpenChange(true)}
        endIcon={<ExpandMoreIcon />}
      >
        {activeItem.name}
      </Button>
      <Popover
        open={open}
        onClose={() => onOpenChange(false)}
        anchorEl={anchorRef.current}
        sx={{
          marginTop: 2,
          borderRadius: 8,
          boxShadow: "none",
          background: "none",
          "& .MuiPaper-root": {
            boxShadow: "none !important",
            background: "none !important",
            overflow: "visible",
          },
          "&:hover": {
            border: "none !important",
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <List sx={{ background: "white", border: "none" }}>
          {items.map((item, index) => (
            <ListItem
              button
              key={index}
              sx={{ gap: 2 }}
              onClick={() => {
                item.command(editor)
                onOpenChange(false)
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <Typography variant="body2" fontSize={14} fontFamily={typography.fontFamilies.sans}>
                {item.name}
              </Typography>

              {activeItem.name === item.name && <CheckIcon color="primary" />}
            </ListItem>
          ))}
        </List>
      </Popover>
    </Box>
  )
}

export default NodeSelector

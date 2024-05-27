import React from "react"
import { useEditor } from "novel"
import Popover from "@mui/material/Popover"
import Button from "@mui/material/Button"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemIcon from "@mui/material/ListItemIcon"
import Typography from "@mui/material/Typography"
import CheckIcon from "@mui/icons-material/Check"

export interface BubbleColorMenuItem {
  name: string
  color: string
}

const TEXT_COLORS: BubbleColorMenuItem[] = [
  {
    name: "Default",
    color: "var(--novel-black)",
  },
  {
    name: "Purple",
    color: "#9333EA",
  },
  {
    name: "Red",
    color: "#E00000",
  },
  {
    name: "Yellow",
    color: "#EAB308",
  },
  {
    name: "Blue",
    color: "#2563EB",
  },
  {
    name: "Green",
    color: "#008A00",
  },
  {
    name: "Orange",
    color: "#FFA500",
  },
  {
    name: "Pink",
    color: "#BA4081",
  },
  {
    name: "Gray",
    color: "#A8A29E",
  },
]

const HIGHLIGHT_COLORS: BubbleColorMenuItem[] = [
  {
    name: "Default",
    color: "#E00000",
  },
  {
    name: "Purple",
    color: "var(--novel-highlight-purple)",
  },
  {
    name: "Red",
    color: "var(--novel-highlight-red)",
  },
  {
    name: "Yellow",
    color: "var(--novel-highlight-yellow)",
  },
  {
    name: "Blue",
    color: "var(--novel-highlight-blue)",
  },
  {
    name: "Green",
    color: "var(--novel-highlight-green)",
  },
  {
    name: "Orange",
    color: "var(--novel-highlight-orange)",
  },
  {
    name: "Pink",
    color: "var(--novel-highlight-pink)",
  },
  {
    name: "Gray",
    color: "var(--novel-highlight-gray)",
  },
]

interface ColorSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const ColorSelector = ({ open, onOpenChange }: ColorSelectorProps) => {
  const { editor } = useEditor()
  const anchorRef = React.useRef(null)

  if (!editor) return null
  const activeColorItem = TEXT_COLORS.find(({ color }) => editor.isActive("textStyle", { color }))
  const activeHighlightItem = HIGHLIGHT_COLORS.find(({ color }) => editor.isActive("highlight", { color }))

  return (
    <div>
      <Button size="small" ref={anchorRef} onClick={() => onOpenChange(true)} sx={{ textTransform: "none" }}>
        <span style={{ color: activeColorItem?.color, backgroundColor: activeHighlightItem?.color }}>A</span>
        <ExpandMoreIcon />
      </Button>
      <Popover
        open={open}
        anchorEl={anchorRef.current}
        onClose={() => onOpenChange(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <List sx={{ maxWidth: 360 }}>
          <Typography sx={{ m: 1, fontWeight: "bold" }}>Color</Typography>
          {TEXT_COLORS.map(({ name, color }) => (
            <ListItem
              button
              key={name}
              onClick={() => {
                editor.commands.unsetColor()
                if (name !== "Default") {
                  editor
                    .chain()
                    .focus()
                    .setColor(color || "")
                    .run()
                }
              }}
              sx={{ py: 0.5 }}
            >
              <ListItemIcon>
                <span style={{ color }}>A</span>
              </ListItemIcon>
              <ListItemText primary={name} />
            </ListItem>
          ))}
          <Typography sx={{ m: 1, fontWeight: "bold" }}>Background</Typography>
          {HIGHLIGHT_COLORS.map(({ name, color }) => (
            <ListItem
              button
              key={name}
              onClick={() => {
                editor.commands.unsetHighlight()
                if (name !== "Default") {
                  editor.commands.setHighlight({ color })
                }
              }}
              sx={{ py: 0.5 }}
            >
              <ListItemIcon>
                <span style={{ backgroundColor: color }}>A</span>
              </ListItemIcon>
              <ListItemText primary={name} />
              {editor.isActive("highlight", { color }) && <CheckIcon />}
            </ListItem>
          ))}
        </List>
      </Popover>
    </div>
  )
}

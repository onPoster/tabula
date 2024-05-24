import React from "react"
import { useEditor, EditorInstance } from "novel"
import IconButton from "@mui/material/IconButton"
import { SvgIconComponent } from "@mui/icons-material"
import { ReactComponent as BoldIcon } from "@/assets/images/boldIcon.svg"
import { ReactComponent as ItalicIcon } from "@/assets/images/italicIcon.svg"
import { ReactComponent as UnderlineIcon } from "@/assets/images/underlineIcon.svg"
import { ReactComponent as StrikethroughIcon } from "@/assets/images/strikethroughIcon.svg"
import { ReactComponent as CodeIcon } from "@/assets/images/codeIcon.svg"

interface SelectorItem {
  name: string
  icon: SvgIconComponent
  command: (editor: EditorInstance) => void
  isActive: (editor: EditorInstance) => boolean
}

export const TextButtons: React.FC = () => {
  const { editor } = useEditor()
  if (!editor) return null

  const items: SelectorItem[] = [
    {
      name: "bold",
      isActive: (editor) => editor.isActive("bold"),
      command: (editor) => editor.chain().focus().toggleBold().run(),
      icon: BoldIcon,
    },
    {
      name: "italic",
      isActive: (editor) => editor.isActive("italic"),
      command: (editor) => editor.chain().focus().toggleItalic().run(),
      icon: ItalicIcon,
    },
    {
      name: "underline",
      isActive: (editor) => editor.isActive("underline"),
      command: (editor) => editor.chain().focus().toggleUnderline().run(),
      icon: UnderlineIcon,
    },
    {
      name: "strike",
      isActive: (editor) => editor.isActive("strike"),
      command: (editor) => editor.chain().focus().toggleStrike().run(),
      icon: StrikethroughIcon,
    },
    {
      name: "code",
      isActive: (editor) => editor.isActive("code"),
      command: (editor) => editor.chain().focus().toggleCode().run(),
      icon: CodeIcon,
    },
  ]

  return (
    <div style={{ display: "flex", gap: 8 }}>
      {items.map((item, index) => (
        <IconButton
          key={index}
          onClick={() => item.command(editor)}
          sx={{
            backgroundColor: item.isActive(editor) ? "rgba(75, 74, 70, 0.2)" : "rgba(75, 74, 70, 0.05)",
            "&:hover": {
              backgroundColor: "rgba(75, 74, 70, 0.1)",
            },
            borderRadius: "8px",
          }}
          size="large"
        >
          <item.icon />
        </IconButton>
      ))}
    </div>
  )
}

export default TextButtons

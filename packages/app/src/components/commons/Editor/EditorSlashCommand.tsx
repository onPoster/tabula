import { useCallback } from "react"
import { createSuggestionItems } from "novel/extensions"
import { Command, renderItems } from "novel/extensions"
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft"
import ChecklistIcon from "@mui/icons-material/Checklist"
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted"
import { typography } from "@/theme"
import { Typography } from "@mui/material"
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered"
import FormatQuoteIcon from "@mui/icons-material/FormatQuote"
import CodeIcon from "@mui/icons-material/Code"
import ImageIcon from "@mui/icons-material/Image"
import { createImageUpload } from "novel/plugins"
import { useIPFSContext } from "@/services/ipfs/context"

const useSuggestionItems = () => {
  const { encodeIpfsHash } = useIPFSContext()

  const onUpload = async (file: File) => {
    console.log("entre")
    return encodeIpfsHash(file).then((hash) => {
      const imageUrl = `https://ipfs.io/ipfs/${hash}`
      console.log("imageUrl", imageUrl)
      return imageUrl
    })
  }

  const suggestionItems = createSuggestionItems([
    {
      title: "Text",
      description: "Just start typing with plain text.",
      searchTerms: ["p", "paragraph"],
      icon: <FormatAlignLeftIcon />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").run()
      },
    },
    {
      title: "To-do List",
      description: "Track tasks with a to-do list.",
      searchTerms: ["todo", "task", "list", "check", "checkbox"],
      icon: <ChecklistIcon />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleTaskList().run()
      },
    },
    {
      title: "Heading 1",
      description: "Big section heading.",
      searchTerms: ["title", "big", "large"],
      icon: (
        <Typography variant="body1" fontWeight={600} fontFamily={typography.fontFamilies.sans}>
          H1
        </Typography>
      ),
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run()
      },
    },
    {
      title: "Heading 2",
      description: "Medium section heading.",
      searchTerms: ["subtitle", "medium"],
      icon: (
        <Typography variant="body1" fontWeight={600} fontFamily={typography.fontFamilies.sans}>
          H2
        </Typography>
      ),
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run()
      },
    },
    {
      title: "Heading 3",
      description: "Small section heading.",
      searchTerms: ["subtitle", "small"],
      icon: (
        <Typography variant="body1" fontWeight={600} fontFamily={typography.fontFamilies.sans}>
          H3
        </Typography>
      ),
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run()
      },
    },
    {
      title: "Bullet List",
      description: "Create a simple bullet list.",
      searchTerms: ["unordered", "point"],
      icon: <FormatListBulletedIcon />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run()
      },
    },
    {
      title: "Numbered List",
      description: "Create a list with numbering.",
      searchTerms: ["ordered"],
      icon: <FormatListNumberedIcon />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run()
      },
    },
    {
      title: "Quote",
      description: "Capture a quote.",
      searchTerms: ["blockquote"],
      icon: <FormatQuoteIcon />,
      command: ({ editor, range }) =>
        editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").toggleBlockquote().run(),
    },
    {
      title: "Code",
      description: "Capture a code snippet.",
      searchTerms: ["codeblock"],
      icon: <CodeIcon />,
      command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
    },
    {
      title: "Image",
      description: "Upload an image from your computer.",
      searchTerms: ["photo", "picture", "media"],
      icon: <ImageIcon />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).run()
        const input = document.createElement("input")
        input.type = "file"
        input.accept = "image/*"
        input.onchange = async () => {
          if (input.files?.length) {
            const file = input.files[0]
            if (file && file.type.includes("image/") && file.size / 1024 / 1024 <= 10) {
              createImageUpload({
                onUpload,
                validateFn: (file) => {
                  if (!file.type.includes("image/")) {
                    console.error("File type not supported.")
                    return false
                  } else if (file.size / 1024 / 1024 > 10) {
                    console.error("File size too big (max 10MB).")
                    return false
                  }
                  return true
                },
              })
              const imageUrl = await onUpload(file)
              editor.chain().focus().setImage({ src: imageUrl }).run()
            }
          }
        }
        input.click()
      },
    },
  ])

  return {
    suggestionItems,
    slashCommand: Command.configure({
      suggestion: {
        items: () => suggestionItems,
        render: renderItems,
      },
    }),
  }
}

export default useSuggestionItems

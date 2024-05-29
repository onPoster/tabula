import { Theme } from "@mui/material"
import { makeStyles } from "@mui/styles"
import {
  TiptapImage,
  TiptapLink,
  UpdatedImage,
  TaskList,
  TaskItem,
  HorizontalRule,
  Placeholder,
  AIHighlight,
} from "novel/extensions"
import { UploadImagesPlugin } from "novel/plugins"
import { StarterKit } from "@tiptap/starter-kit"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { common, createLowlight } from "lowlight"
const useStyles = makeStyles((theme: Theme) => ({
  link: {
    textDecoration: "underline",
    textUnderlineOffset: "3px",
    color: theme.palette.text.secondary,
    "&:hover": {
      color: theme.palette.primary.main,
    },
    cursor: "pointer",
    transition: "color 0.3s",
  },
  image: {
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
  },
  taskList: {
    paddingLeft: theme.spacing(2),
  },
  taskItem: {
    display: "flex",
    gap: theme.spacing(2),
    alignItems: "start",
    marginBottom: theme.spacing(1),
  },
  horizontalRule: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(6),
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  bulletList: {
    listStyleType: "disc",
    marginLeft: theme.spacing(2),
    lineHeight: 1.5,
    marginTop: theme.spacing(2),
  },
  orderedList: {
    listStyleType: "decimal",
    marginLeft: theme.spacing(2),
    lineHeight: 1.5,
    marginTop: theme.spacing(1),
  },
  listItem: {
    lineHeight: "normal",
    marginBottom: theme.spacing(1),
  },
  blockquote: {
    paddingLeft: theme.spacing(2),
  },

  codeBlock: {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "#1f2937",
    color: "#fff",
    fontFamily: "JetBrainsMono, monospace",
    padding: theme.spacing(1.5, 2),
    fontSize: "12px",
    "& code": {
      background: "none",
      color: "inherit",
      fontSize: "0.8rem",
      padding: 0,
    },
    "& .hljs-comment, & .hljs-quote": {
      color: "#616161",
    },
    "& .hljs-variable, & .hljs-template-variable, & .hljs-attribute, & .hljs-tag, & .hljs-name, & .hljs-regexp, & .hljs-link, & .hljs-name, & .hljs-selector-id, & .hljs-selector-class":
      {
        color: "#f98181",
      },
    "& .hljs-number, & .hljs-meta, & .hljs-built_in, & .hljs-builtin-name, & .hljs-literal, & .hljs-type, & .hljs-params":
      {
        color: "#fbbc88",
      },
    "& .hljs-string, & .hljs-symbol, & .hljs-bullet": {
      color: "#b9f18d",
    },
    "& .hljs-title, & .hljs-section": {
      color: "#faf594",
    },
    "& .hljs-keyword, & .hljs-selector-tag": {
      color: "#70cff8",
    },
    "& .hljs-emphasis": {
      fontStyle: "italic",
    },
    "& .hljs-strong": {
      fontWeight: 700,
    },
  },
  code: {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "#1f2937",
    fontSize: "12px",
    color: "#fff",
    fontFamily: "JetBrainsMono, monospace",
    padding: theme.spacing(1),
    fontWeight: "medium",
    spellcheck: "false",
  },
}))

const useExtensions = () => {
  const classes = useStyles()

  const aiHighlight = AIHighlight
  const placeholder = Placeholder
  const tiptapLink = TiptapLink.configure({
    HTMLAttributes: {
      class: classes.link,
    },
  })

  const tiptapImage = TiptapImage.extend({
    addProseMirrorPlugins() {
      return [
        UploadImagesPlugin({
          imageClass: classes.image,
        }),
      ]
    },
  }).configure({
    allowBase64: true,
    HTMLAttributes: {
      class: classes.image,
    },
  })

  const updatedImage = UpdatedImage.configure({
    HTMLAttributes: {
      class: classes.image,
    },
  })

  const taskList = TaskList.configure({
    HTMLAttributes: {
      class: classes.taskList,
    },
  })

  const taskItem = TaskItem.configure({
    HTMLAttributes: {
      class: classes.taskItem,
    },
    nested: true,
  })

  const horizontalRule = HorizontalRule.configure({
    HTMLAttributes: {
      class: classes.horizontalRule,
    },
  })

  const starterKit = StarterKit.configure({
    bulletList: {
      HTMLAttributes: {
        class: classes.bulletList,
      },
    },
    orderedList: {
      HTMLAttributes: {
        class: classes.orderedList,
      },
    },
    listItem: {
      HTMLAttributes: {
        class: classes.listItem,
      },
    },
    blockquote: {
      HTMLAttributes: {
        class: classes.blockquote,
      },
    },
    codeBlock: false,
    code: {
      HTMLAttributes: {
        class: classes.code,
        spellcheck: "false",
      },
    },
    horizontalRule: false,
    dropcursor: {
      color: "#DBEAFE",
      width: 4,
    },
    gapcursor: false,
  })

  const codeBlockLowlight = CodeBlockLowlight.configure({
    // configure lowlight: common /  all / use highlightJS in case there is a need to specify certain language grammars only
    // common: covers 37 language grammars which should be good enough in most cases
    lowlight: createLowlight(common),
  })

  return [
    starterKit,
    placeholder,
    tiptapLink,
    tiptapImage,
    updatedImage,
    taskList,
    taskItem,
    horizontalRule,
    aiHighlight,
    codeBlockLowlight,
  ]
}

export default useExtensions

import React, { useEffect, useState } from "react"
import {
  EditorRoot,
  EditorCommand,
  EditorCommandItem,
  EditorCommandEmpty,
  EditorContent,
  type JSONContent,
  EditorCommandList,
  EditorBubble,
  EditorInstance,
} from "novel"
import { ImageResizer, handleCommandNavigation } from "novel/extensions"
import { handleImageDrop, handleImagePaste } from "novel/plugins"
import NodeSelector from "./selector/NodeSelector"
import { LinkSelector } from "./selector/LinkSelector"
import TextButtons from "./selector/TextButtons"
import { Box, Typography } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { typography } from "@/theme"
import { useDebouncedCallback } from "use-debounce"
import hljs from "highlight.js"
import "highlight.js/styles/github.css"
import useExtensions from "./extensions"
import useSuggestionItems from "./EditorSlashCommand"

interface EditorProps {
  initialValue?: JSONContent
  onChange: (value: JSONContent) => void
  onHtml: (value: string) => void
}

const useStyles = makeStyles((theme: any) => ({
  globalStyle: {
    "&[aria-expanded]": {
      "&:focus-visible": {
        outline: "none",
        boxShadow: "none",
        borderColor: "transparent",
      },
    },
  },
  editorContent: {
    fontFamily: typography.fontFamilies.serif,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: 8,
    outline: "none",
    maxWidth: "100%",
    "&:focus-visible": {
      outline: "none",
      boxShadow: "none",
      borderColor: "transparent",
    },
    "&:focus": {
      outline: "none",
      boxShadow: "none",
      borderColor: "transparent",
    },
  },

  editorCommand: {
    position: "relative",
    height: "auto",
    maxHeight: "330px",
    overflowY: "auto",
    borderRadius: 8,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1, 2),
    boxShadow: theme.shadows[3],
  },
  editorBubble: {
    display: "flex",
    width: "fit-content",
    maxWidth: "90vw",
    overflow: "hidden",
    borderRadius: 8,
    padding: 8,
    gap: 8,
    backgroundColor: theme.palette.background.paper,
    boxShadow: "rgba(0, 0, 0, 0.1)",
  },
  noResults: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  commandItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: theme.spacing(1),
    borderRadius: 8,
    padding: theme.spacing(1),
    margin: theme.spacing(0.5, 0),
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    '&[aria-selected="true"]': {
      backgroundColor: theme.palette.action.selected,
    },
    width: "100%",
    cursor: "pointer",
  },
  commandIconContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: theme.spacing(5),
    width: theme.spacing(5),
    borderRadius: 8,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
  },
  commandText: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  commandDescription: {
    fontSize: theme.typography.pxToRem(12),
    color: theme.palette.text.secondary,
  },
}))

const Editor: React.FC<EditorProps> = ({ initialValue, onChange, onHtml }) => {
  const classes = useStyles()
  const extensions = useExtensions()
  // const [saveStatus, setSaveStatus] = useState("Saved")
  const [openNode, setOpenNode] = useState<boolean>(false)
  const [openLink, setOpenLink] = useState<boolean>(false)
  const { suggestionItems, slashCommand } = useSuggestionItems()

  useEffect(() => {
    hljs.highlightAll()
  }, [])

  const debouncedUpdates = useDebouncedCallback(async (editor: EditorInstance) => {
    const json = editor.getJSON()

    // window.localStorage.setItem("html-content", editor.getHTML())
    // window.localStorage.setItem("novel-content", JSON.stringify(json))
    // window.localStorage.setItem("markdown", editor.storage.markdown.getMarkdown())
    onChange(json)
    onHtml(editor.getHTML())
    // setSaveStatus("Saved")
  }, 500)

  // useEffect(() => {
  //   const content = window.localStorage.getItem("novel-content")
  //   if (content) setInitialContent(JSON.parse(content))
  //   else setInitialContent(defaultEditorContent)
  // }, [])

  return (
    <EditorRoot>
      <EditorContent
        className={classes.editorContent}
        {...(initialValue && { initialContent: initialValue })}
        extensions={[...extensions, slashCommand]}
        editorProps={{
          handleDOMEvents: {
            keydown: (_view, event) => handleCommandNavigation(event),
          },
          handlePaste: (view, event) => handleImagePaste(view, event, (e) => console.log("e", e)),
          handleDrop: (view, event, _slice, moved) =>
            handleImageDrop(view, event, moved, (e: any) => console.log("e", e)),
          attributes: {
            class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
          },
        }}
        onUpdate={({ editor }) => {
          debouncedUpdates(editor)
          // setSaveStatus("Unsaved")
        }}
        slotAfter={<ImageResizer />}
      >
        <EditorCommand className={classes.editorCommand}>
          <EditorCommandEmpty className={classes.noResults}>No results</EditorCommandEmpty>
          <EditorCommandList>
            {suggestionItems.map((item: any) => (
              <EditorCommandItem
                value={item.title}
                onCommand={(val) => item.command?.(val)}
                className={classes.commandItem}
                key={item.title}
              >
                <Box className={classes.commandIconContainer}>{item.icon}</Box>
                <Box>
                  <Typography variant="body2" fontWeight={600} fontSize={14} fontFamily={typography.fontFamilies.sans}>
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontSize={10}
                    className={classes.commandDescription}
                    fontFamily={typography.fontFamilies.sans}
                  >
                    {item.description}
                  </Typography>
                </Box>
              </EditorCommandItem>
            ))}
          </EditorCommandList>
        </EditorCommand>

        <EditorBubble
          tippyOptions={{
            placement: "top",
          }}
          className={classes.editorBubble}
        >
          <NodeSelector open={openNode} onOpenChange={setOpenNode} />
          <LinkSelector open={openLink} onOpenChange={setOpenLink} />
          <TextButtons />
        </EditorBubble>
      </EditorContent>
    </EditorRoot>
  )
}

export default Editor

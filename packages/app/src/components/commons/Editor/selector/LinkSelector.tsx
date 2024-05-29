import React, { useRef, useEffect, Fragment } from "react"
import { useEditor } from "novel"
import IconButton from "@mui/material/IconButton"
import Popover from "@mui/material/Popover"
import TextField from "@mui/material/TextField"
import CheckIcon from "@mui/icons-material/Check"
import RemoveCircleOutlineSharpIcon from "@mui/icons-material/RemoveCircleOutlineSharp"
import Box from "@mui/material/Box"
import { ReactComponent as LinkIcon } from "@/assets/images/linkIcon.svg"

export function isValidUrl(url: string) {
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}
export function getUrlFromString(str: string) {
  if (isValidUrl(str)) return str
  try {
    if (str.includes(".") && !str.includes(" ")) {
      return new URL(`https://${str}`).toString()
    }
  } catch (e) {
    return null
  }
}

interface LinkSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const LinkSelector: React.FC<LinkSelectorProps> = ({ open, onOpenChange }) => {
  const { editor } = useEditor()
  const inputRef = useRef<HTMLInputElement>(null)
  const anchorRef = useRef<HTMLButtonElement>(null)
  // Autofocus on input by default
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  if (!editor) return null

  const handleSubmit = (e: any) => {
    e.preventDefault()
    const url = inputRef?.current && getUrlFromString(inputRef.current.value)
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
      onOpenChange(false) // Close popover after setting the link
    }
  }

  const unsetLink = () => {
    editor.chain().focus().unsetLink().run()
    onOpenChange(false) // Close popover after unsetting the link
  }

  return (
    <Fragment>
      <IconButton
        ref={anchorRef}
        onClick={() => onOpenChange(true)}
        sx={{
          backgroundColor: editor.isActive(editor) ? "rgba(75, 74, 70, 0.2)" : "rgba(75, 74, 70, 0.05)",
          "&:hover": {
            backgroundColor: "rgba(75, 74, 70, 0.1)",
          },
          borderRadius: "8px",
        }}
        size="large"
      >
        <LinkIcon />
      </IconButton>
      <Popover
        open={open}
        onClose={() => onOpenChange(false)}
        anchorEl={anchorRef.current}
        sx={{
          marginTop: 1.5,
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
        <Box
          sx={{
            width: 320,
          }}
        >
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              variant="outlined"
              sx={{
                borderRadius: 0,
                border: "none",
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    border: "none",
                  },
                  "&.Mui-focused fieldset": {
                    border: "none",
                  },
                },
              }}
              size="small"
              inputRef={inputRef}
              defaultValue={editor.getAttributes("link").href || ""}
              placeholder="Enter your link..."
              InputProps={{
                style: {
                  border: "none",
                  background: "white",
                },
                endAdornment: editor.getAttributes("link").href ? (
                  <IconButton onClick={unsetLink} color="primary">
                    <RemoveCircleOutlineSharpIcon />
                  </IconButton>
                ) : (
                  <IconButton type="submit" color="primary">
                    <CheckIcon />
                  </IconButton>
                ),
              }}
            />
          </form>
        </Box>
      </Popover>
    </Fragment>
  )
}

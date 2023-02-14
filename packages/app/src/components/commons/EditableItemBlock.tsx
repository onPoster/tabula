import { Add } from "@mui/icons-material"
import { InputLabel } from "@mui/material"
import React, { ChangeEvent, createRef, useEffect, useRef, useState } from "react"
import ContentEditable, { ContentEditableEvent } from "react-contenteditable"
import { palette, typography } from "../../theme"
import InlineRichText from "./InlineRichText"
import { RICH_TEXT_ELEMENTS } from "./RichText"

export interface EditableItemBlockProps {
  block: Block
  onChange?: (event: ContentEditableEvent) => void
  onBlur?: (event: React.FormEvent<HTMLDivElement>) => void
  onInput?: (event: React.FormEvent<HTMLDivElement>) => void
  onKeyPress?: (event: React.KeyboardEvent<HTMLDivElement>) => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void
  onImageSelected?: (uri: string) => void
  placeholder?: string
}

export interface Block {
  id: string
  html: string
  tag: string
  previousKey?: string
  htmlBackup?: null | string
  imageUrl?: string
}

export const EditableItemBlock: React.FC<EditableItemBlockProps> = ({
  block,
  onChange,
  onInput,
  onBlur,
  onKeyPress,
  onKeyDown,
  onImageSelected,
  placeholder,
}) => {
  const contentEditableRef = useRef<null | HTMLElement>(null)
  const inputFile = useRef<HTMLInputElement | null>(null)
  const [inlineRichTextRef, setInlineRichTextRef] = useState<any>(null)
  const [inlineOffset, setInlineOffset] = useState<number | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uri, setUri] = useState<string | null | undefined>(null)

  const openImagePicker = () => inputFile && inputFile.current?.click()

  const onChangeRef = useRef(onChange)
  const onInputRef = useRef(onInput)
  const onBlurRef = useRef(onBlur)
  const onKeyPressRef = useRef(onKeyPress)
  const onKeyDownRef = useRef(onKeyDown)

  const onSelectionChange = (e: Event) => {
    const selection = window.getSelection()
    if (!selection?.isCollapsed) {
      console.log(selection)
      setInlineOffset(selection ? selection.anchorOffset : null)
      setInlineRichTextRef(contentEditableRef)
    } else {
      setInlineOffset(null)
      setInlineRichTextRef(null)
    }
  }

  useEffect(() => {
    document.addEventListener("selectionchange", onSelectionChange)
    return () => {
      document.removeEventListener("selectionchange", onSelectionChange)
    }
  }, [])
  useEffect(() => {
    if (block.tag === RICH_TEXT_ELEMENTS.DIVIDER) {
      const dividerElement = document.getElementById(block.id)
      if (dividerElement) {
        dividerElement.contentEditable = "false"
      }
    }
  }, [block.html, block.id, block.tag])
  useEffect(() => {
    setUri(block.imageUrl)
  }, [block.imageUrl])
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])
  useEffect(() => {
    onInputRef.current = onInput
  }, [onInput])
  useEffect(() => {
    onBlurRef.current = onBlur
  }, [onBlur])
  useEffect(() => {
    onKeyPressRef.current = onKeyPress
  }, [onKeyPress])
  useEffect(() => {
    onKeyDownRef.current = onKeyDown
  }, [onKeyDown])

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader()
      reader.onload = (e) => {
        setUri(e.target?.result as string)
        if (onImageSelected) {
          onImageSelected(e.target?.result as string)
        }
      }
      console.log("file", file)
      setFile(event.target.files[0])
      reader.readAsDataURL(event.target.files[0])
    }
  }

  return (
    <>
      {block.tag !== RICH_TEXT_ELEMENTS.IMAGE && (
        <ContentEditable
          id={block.id}
          className={block.tag}
          innerRef={contentEditableRef}
          html={block.html}
          tagName={block.tag === RICH_TEXT_ELEMENTS.DIVIDER ? "div" : block.tag}
          placeholder={placeholder}
          onChange={
            onChange
              ? (...args) => {
                  if (onChangeRef.current) {
                    onChangeRef.current(...args)
                  }
                }
              : () => {}
          }
          onInput={
            onInput
              ? (...args) => {
                  if (onInputRef.current) {
                    onInputRef.current(...args)
                  }
                }
              : undefined
          }
          onBlur={
            onBlur
              ? (...args) => {
                  if (onBlurRef.current) {
                    onBlurRef.current(...args)
                  }
                }
              : undefined
          }
          onKeyPress={
            onKeyPress
              ? (...args) => {
                  if (onKeyPressRef.current) {
                    onKeyPressRef.current(...args)
                  }
                }
              : undefined
          }
          onKeyDown={
            onKeyDown
              ? (...args) => {
                  if (onKeyDownRef.current) {
                    onKeyDownRef.current(...args)
                  }
                }
              : undefined
          }
        />
      )}
      {block.tag === RICH_TEXT_ELEMENTS.IMAGE && (
        <div>
          <input type="file" id={`${block.id}-img`} ref={inputFile} hidden accept="image/*" onChange={handleImage} />
          {!uri && (
            <InputLabel
              htmlFor={`${block.id}_fileInput`}
              onClick={openImagePicker}
              sx={{
                alignItems: "center",
                backdropFilter: "blur(2px)",
                backgroundColor: palette.grays[50],
                border: `1px solid ${palette.grays[200]}`,
                borderRadius: 1,
                cursor: "pointer",
                color: palette.grays[600],
                fontFamily: typography.fontFamilies.serif,
                fontSize: 14,
                textTransform: "unset",
                letterSpacing: "unset",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                minHeight: 160,
                "&:hover": {
                  background: palette.grays[200],
                },
              }}
            >
              <Add sx={{ color: palette.grays[800], mb: 1 }} />
              No Image Selected. Click To Select.
            </InputLabel>
          )}
          {uri && <img src={uri} alt="" />}
        </div>
      )}
      <InlineRichText showCommand={typeof inlineOffset === "number"} inlineRichTextRef={inlineRichTextRef} />
    </>
  )
}

import { Add } from "@mui/icons-material"
import InputLabel from "@mui/material/InputLabel"
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from "react"
import ContentEditable, { ContentEditableEvent } from "react-contenteditable"
import { palette, typography } from "../../theme"
import { toBase64 } from "../../utils/string-handler"
import InlineRichText from "./InlineRichText"
import { RICH_TEXT_ELEMENTS } from "./RichText"
import { useUpdateCallbackRef } from "../../hooks/useRefCallback"
import { Box } from "@mui/material"
import { useArticleContext } from "../../services/publications/contexts"

export type BlockItemClassName =
  | "code"
  | "strikethrough"
  | " underline"
  | "bold"
  | "italic"
  | "divider"
  | "p"
  | "a"
  | "img"
  | "em"
  | "blockquote"
  | "pre"
export interface EditableItemBlockProps {
  block: Block
  onChange?: (event: ContentEditableEvent) => void
  onBlur?: (event: React.FormEvent<HTMLDivElement>) => void
  onInput?: (event: React.FormEvent<HTMLDivElement>) => void
  onKeyPress?: (event: React.KeyboardEvent<HTMLDivElement>) => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void
  onImageSelected?: (uri: string, file: File) => void
  placeholder?: string
}

export interface Block {
  id: string
  html: string
  styles?: { start: number; end: number; style: string }[]
  tag: string
  className?: string
  previousKey?: string
  htmlBackup?: null | string
  imageUrl?: string
  imageFile?: File
}

export const EditableItemBlock: React.FC<EditableItemBlockProps> = React.memo(
  ({ block, onChange, onInput, onBlur, onKeyPress, onKeyDown, onImageSelected, placeholder }) => {
    const contentEditableRef = useRef<HTMLDivElement>(null)
    const inputFile = useRef<HTMLInputElement | null>(null)
    const [inlineRichTextRef, setInlineRichTextRef] = useState<React.RefObject<HTMLElement> | null>(null)
    const [inlineOffset, setInlineOffset] = useState<number | null>(null)
    const [uri, setUri] = useState<string | null | undefined>(null)
    const [currentSelection, setCurrentSelection] = useState<Selection | null>()
    const [currentRange, setCurrentRange] = useState<Range | null>()
    const { articleContent, setArticleContent } = useArticleContext()

    const openImagePicker = useCallback(() => inputFile?.current?.click(), [inputFile])

    const onChangeRef = useUpdateCallbackRef(onChange)
    const onInputRef = useUpdateCallbackRef(onInput)
    const onBlurRef = useUpdateCallbackRef(onBlur)
    const onKeyPressRef = useUpdateCallbackRef(onKeyPress)
    const onKeyDownRef = useUpdateCallbackRef(onKeyDown)

    const handleMouseUp = () => {
      const selection = window.getSelection()
      if (selection?.isCollapsed) {
        setInlineOffset(null)
        setInlineRichTextRef(null)
        return
      }
      if (selection) {
        const container = selection.anchorNode?.parentElement
        const element = container?.closest("[contenteditable=true]") as HTMLElement

        if (element === contentEditableRef.current) {
          setInlineOffset(selection?.anchorOffset ?? null)
          setInlineRichTextRef(contentEditableRef)
        }
        if (selection && selection.rangeCount > 0) {
          setCurrentSelection(selection)
          const range = selection.getRangeAt(0).cloneRange()
          console.log("range", range)
          setCurrentRange(range)
        }
      }
    }

    const applyInlineStyles = (className: string) => {
      if (currentSelection && currentRange) {
        const start = currentRange.startOffset
        const end = currentRange.endOffset
        // Encuentra el bloque con el id dado
        const item = articleContent.find((item) => item.id === block.id)
        if (!item) return
        const newStyle = { start, end, style: className }
        const newStyles = item.styles ? [...item.styles, newStyle] : [newStyle]
        const newBlocks = articleContent.map((item) => (item.id === block.id ? { ...item, styles: newStyles } : item))
        setArticleContent(newBlocks)
        setInlineOffset(null)
        setInlineRichTextRef(null)
        console.log("newBlocks", newBlocks)
      }
    }

    useEffect(() => {
      const currentElement = contentEditableRef.current
      if (currentElement) {
        currentElement.addEventListener("mouseup", handleMouseUp)
      }
      return () => {
        if (currentElement) {
          currentElement.removeEventListener("mouseup", handleMouseUp)
        }
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
      if (block.imageFile) {
        const transformFile = async () => {
          const result = await toBase64(block.imageFile as File)
          if (result) {
            setUri(result)
          }
        }
        transformFile()
      }
    }, [block.imageFile])

    useEffect(() => {
      setUri(block.imageUrl)
    }, [block.imageUrl])

    useEffect(() => {
      onChangeRef.current = onChange
    }, [onChange, onChangeRef])

    useEffect(() => {
      onInputRef.current = onInput
    }, [onInput, onInputRef])

    useEffect(() => {
      onBlurRef.current = onBlur
    }, [onBlur, onBlurRef])

    useEffect(() => {
      onKeyPressRef.current = onKeyPress
    }, [onKeyPress, onKeyPressRef])

    useEffect(() => {
      onKeyDownRef.current = onKeyDown
    }, [onKeyDown, onKeyDownRef])

    const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        const reader = new FileReader()
        let imgUri = ""
        reader.onload = (e) => {
          setUri(e.target?.result as string)
          imgUri = e.target?.result as string
        }

        if (onImageSelected) {
          onImageSelected(imgUri, event.target.files[0])
        }

        reader.readAsDataURL(event.target.files[0])
      }
    }

    const isContentEditableSupported = () => {
      const div = document.createElement("div")
      div.contentEditable = "true"
      const contentEditableValue = div.contentEditable
      return contentEditableValue === "true" || contentEditableValue === ""
    }

    const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
      event.preventDefault()

      const clipboardText = event.clipboardData?.getData("text/plain")
      if (!clipboardText) return

      const selection = window.getSelection()
      if (!selection) return

      const range = selection.getRangeAt(0)
      range.deleteContents()

      const textNode = document.createTextNode(clipboardText)
      range.insertNode(textNode)

      range.setStartAfter(textNode)
      range.setEndAfter(textNode)
      selection.removeAllRanges()
      selection.addRange(range)

      if (onChange) {
        const value: ContentEditableEvent = {
          target: { value: contentEditableRef.current?.innerHTML ?? "" },
        } as ContentEditableEvent
        onChange(value)
      }
    }

    function blockContentToHTML(block: Block): string {
      if (!block.styles || block.styles.length === 0) {
        return block.html // si no hay estilos, devuelve el html original
      }

      // inicializa un array de estilos para cada carácter
      const charStyles: string[][] = Array(block.html.length).fill([])

      // aplica cada estilo a los caracteres correspondientes
      for (const { start, end, style } of block.styles) {
        for (let i = start; i < end; i++) {
          charStyles[i] = [...charStyles[i], style]
        }
      }

      // construye el HTML con los estilos anidados
      let styledHTML = ""
      let currentStyles: string[] = []
      for (let i = 0; i < charStyles.length; i++) {
        const styles = charStyles[i]

        // cierra los estilos que ya no se aplican
        for (let j = currentStyles.length - 1; j >= 0; j--) {
          if (!styles.includes(currentStyles[j])) {
            styledHTML += "</span>"
            currentStyles.pop()
          }
        }

        // abre nuevos estilos
        for (let j = currentStyles.length; j < styles.length; j++) {
          styledHTML += `<span class="${styles[j]}">`
          currentStyles.push(styles[j])
        }

        // añade el carácter actual
        styledHTML += block.html[i]
      }

      // cierra todos los estilos abiertos
      for (let j = currentStyles.length - 1; j >= 0; j--) {
        styledHTML += "</span>"
      }

      return styledHTML
    }

    return (
      <Box>
        {block.tag !== RICH_TEXT_ELEMENTS.IMAGE && block.tag !== RICH_TEXT_ELEMENTS.DIVIDER && (
          <ContentEditable
            id={block.id}
            className={block.tag}
            innerRef={contentEditableRef}
            html={blockContentToHTML(block)}
            tagName={block.tag}
            placeholder={placeholder}
            contentEditable={isContentEditableSupported() ? "true" : undefined}
            onPaste={handlePaste}
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
        {block.tag === RICH_TEXT_ELEMENTS.DIVIDER && <hr id={`${block.id}-img`} />}

        <InlineRichText
          showCommand={typeof inlineOffset === "number"}
          inlineRichTextRef={inlineRichTextRef}
          block={block}
          onClick={applyInlineStyles}
        />
      </Box>
    )
  },
)

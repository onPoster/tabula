// @ts-nocheck
import React, { useEffect, useRef } from "react"
import ContentEditable, { ContentEditableEvent } from "react-contenteditable"

export interface EditableItemBlockProps {
  block: Block
  onChange?: (event: ContentEditableEvent) => void
  onBlur?: (event: React.FormEvent<HTMLDivElement>) => void
  onInput?: (event: React.FormEvent<HTMLDivElement>) => void
  onKeyPress?: (event: React.KeyboardEvent<HTMLDivElement>) => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void
}

export interface Block {
  id: string
  html: string
  tag: string
  previousKey?: string
  htmlBackup?: null | string
  imageUrl?: string
  placeholder?: boolean
}

export const EditableItemBlock: React.FC<EditableItemBlockProps> = ({
  block,
  onChange,
  onInput,
  onBlur,
  onKeyPress,
  onKeyDown,
}) => {
  const contentEditableRef = useRef<null | HTMLElement>(null)

  const onChangeRef = useRef(onChange)
  const onInputRef = useRef(onInput)
  const onBlurRef = useRef(onBlur)
  const onKeyPressRef = useRef(onKeyPress)
  const onKeyDownRef = useRef(onKeyDown)

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

  return (
    <>
      <ContentEditable
        id={block.id}
        className={block.tag}
        innerRef={contentEditableRef}
        html={block.html}
        tagName={block.tag}
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
    </>
  )
}

//@ts-nocheck
import React, { ChangeEvent, useEffect, useRef, useState } from "react"
import ContentEditable, { ContentEditableEvent } from "react-contenteditable"

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
  const [file, setFile] = useState<File | null>(null)
  const [uri, setUri] = useState<string | null>(null)

  const openImagePicker = () => inputFile && inputFile.current?.click()

  const onChangeRef = useRef(onChange)
  const onInputRef = useRef(onInput)
  const onBlurRef = useRef(onBlur)
  const onKeyPressRef = useRef(onKeyPress)
  const onKeyDownRef = useRef(onKeyDown)

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
        onImageSelected(e.target?.result as string)
      }
      console.log("file", file)
      setFile(event.target.files[0])
      reader.readAsDataURL(event.target.files[0])
    }
  }

  return (
    <>
      {block.tag !== "image" && (
        <ContentEditable
          id={block.id}
          className={block.tag}
          innerRef={contentEditableRef}
          html={block.html}
          tagName={block.tag}
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
      {block.tag === "image" && (
        <div

        // className={[
        //   styles.image,
        //   this.state.actionMenuOpen || this.state.tagSelectorMenuOpen ? styles.blockSelected : null,
        // ].join(" ")}
        >
          <input type="file" id={`${block.id}-img`} ref={inputFile} hidden accept="image/*" onChange={handleImage} />
          {!uri && (
            <label htmlFor={`${block.id}_fileInput`} onClick={openImagePicker}>
              No Image Selected. Click To Select.
            </label>
          )}
          {uri && <img src={uri} alt="" />}
        </div>
      )}
    </>
  )
}

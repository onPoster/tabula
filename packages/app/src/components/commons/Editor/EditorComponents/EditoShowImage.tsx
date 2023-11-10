import React from "react"

const EditorShowImage: React.FC<any> = (props) => {
  const { src } = props.blockProps
  return <img src={src} alt="" />
}
export default EditorShowImage

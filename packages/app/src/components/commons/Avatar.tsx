import { Avatar as MaterialAvatar } from "@mui/material"
import React, { Fragment, useState } from "react"
import { useDynamicFavIcon } from "../../hooks/useDynamicFavIco"
import { usePublicationContext } from "../../services/publications/contexts"
import usePublication from "../../services/publications/hooks/usePublication"
import DeterministicAvatar from "./DeterministicAvatar"

interface AvatarProps {
  publicationSlug: string
  height: number
  width: number
  storeImage?: boolean
  dynamicFavIcon?: boolean
}

const Avatar: React.FC<AvatarProps> = ({ publicationSlug, height, width, storeImage, dynamicFavIcon }) => {
  const { imageSrc, data: publication } = usePublication(publicationSlug)
  const { setPublicationAvatar } = usePublicationContext()
  const [avatar, setAvatar] = useState<string | undefined>(imageSrc)

  useDynamicFavIcon(dynamicFavIcon ? (imageSrc ? imageSrc : avatar) : undefined)
  const handleImage = (uri: string) => {
    if (storeImage && publication && publication.id) {
      setAvatar(uri)
      setPublicationAvatar({ publicationId: publication.id, uri })
    }
  }
  return (
    <Fragment>
      {imageSrc ? (
        <MaterialAvatar sx={{ width, height }} src={imageSrc}>
          {" "}
        </MaterialAvatar>
      ) : publication ? (
        <DeterministicAvatar hash={publication.hash} width={width} height={height} onImageGenerated={handleImage} />
      ) : null}
    </Fragment>
  )
}

export default Avatar

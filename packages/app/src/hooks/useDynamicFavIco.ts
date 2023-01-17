import { useEffect } from "react"

export const useDynamicFavIcon = (image: string | null | undefined) => {
  const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY
  const imageUrl = `${IPFS_GATEWAY}/${image}`
  const favIcon = process.env.PUBLIC_URL + "/favicon.ico"
  useEffect(() => {
    let link = document.querySelector("link[rel~='icon']") as any
    if (!link) {
      link = document.createElement("link")
      link.rel = "icon"
      document.getElementsByTagName("head")[0].appendChild(link)
    }
    link.href = image ? imageUrl : favIcon
  }, [favIcon, image, imageUrl])
}

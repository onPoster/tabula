import { useEffect, useState } from "react"
import { create, CID, IPFSHTTPClient } from "ipfs-http-client"

export const useFiles = () => {
  const [ipfs, setIpfs] = useState<IPFSHTTPClient | undefined>(undefined)

  useEffect(() => {
    try {
      setIpfs(
        create({
          url: "https://ipfs.infura.io:5001/api/v0",
        }),
      )
    } catch (error) {
      setIpfs(undefined)
    }
  }, [])

  const uploadFile = async (file: File): Promise<{ cid: CID; path: string }> => {
    const result = await (ipfs as IPFSHTTPClient).add(file)
    return {
      cid: result.cid,
      path: result.path,
    }
  }

  return { ipfs, uploadFile }
}

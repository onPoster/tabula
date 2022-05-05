import { useEffect, useState } from "react"
import { create, IPFSHTTPClient } from "ipfs-http-client"
import useLocalStorage from "./useLocalStorage"
import { Pinning } from "../models/pinning"
import axios from "axios"
import { useNotification } from "./useNotification"

export const useFiles = () => {
  const [pinning] = useLocalStorage("pinning", undefined)
  const [ipfs, setIpfs] = useState<IPFSHTTPClient | undefined>(undefined)
  const openNotification = useNotification()

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

  const uploadFile = async (file: File | string): Promise<{ cid?: any; path: string }> => {
    const result = await (ipfs as IPFSHTTPClient).add(file)
    if (pinning && result) {
      const pinningService: Pinning = pinning as Pinning
      const fileName = file instanceof File ? file.name : "Article"
      await axios
        .post(
          `${pinningService.endpoint}/pins`,
          { cid: result.path, name: fileName },
          {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${pinningService.accessToken}` },
          },
        )
        .then((e) => {
          console.log("e", e)
          openNotification({
            message: `Successfully pinned ${fileName}!`,
            variant: "success",
            autoHideDuration: 5000,
          })
        })
        .catch((error) => {
          console.error(error)
          openNotification({
            message: `Pinning of ${fileName} failed. [Hash: ${result.path}]`,
            variant: "error",
            autoHideDuration: 5000,
          })
        })
    }
    return {
      cid: result.cid,
      path: result.path,
    }
  }

  return { ipfs, uploadFile }
}

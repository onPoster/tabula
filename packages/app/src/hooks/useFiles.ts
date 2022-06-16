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
    return {
      cid: result.cid,
      path: result.path,
    }
  }

  const pinAction = async (path: string, name: string, msg?: string) => {
    if (pinning) {
      const pinningService: Pinning = pinning as Pinning
      await axios
        .post(
          `${pinningService.endpoint}/pins`,
          { cid: path, name },
          {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${pinningService.accessToken}` },
          },
        )
        .then(() => {
          openNotification({
            message: msg ? msg : "Successfully file pinned!",
            variant: "success",
            autoHideDuration: 5000,
          })
        })
        .catch((error) => {
          console.error(error)
          openNotification({
            message: `Pinning of ${name} failed. [Hash: ${path}]`,
            variant: "error",
            autoHideDuration: 5000,
          })
        })
    }
  }

  const isValidIpfsService = async (data: Pinning): Promise<boolean> => {
    let isValid = false
    await axios
      .get(`${data.endpoint}/pins`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.accessToken}` },
      })
      .then((res) => {
        if (res.status === 200) {
          isValid = true
        }
      })
      .catch((error) => {
        console.error(error)
        isValid = false
      })
    return isValid
  }

  return { ipfs, uploadFile, pinAction, isValidIpfsService }
}

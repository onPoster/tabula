import { useEffect, useState } from "react"
import { create, IPFSHTTPClient } from "ipfs-http-client"
import useLocalStorage from "./useLocalStorage"
import { Pinning } from "../models/pinning"
import axios from "axios"
import { useNotification } from "./useNotification"

const INFURA_PROJECT_ID = process.env.REACT_APP_INFURA_PROJECT_ID
const INFURA_API_KEY = process.env.REACT_APP_INFURA_API_KEY_SECRET

if (typeof INFURA_PROJECT_ID === "undefined") {
  throw new Error(`REACT_APP_INFURA_PROJECT_ID must be a defined environment variable`)
}
if (typeof INFURA_API_KEY === "undefined") {
  throw new Error(`REACT_APP_INFURA_API_KEY_SECRET must be a defined environment variable`)
}

export const useFiles = () => {
  const [pinning] = useLocalStorage("pinning", undefined)
  const [ipfs, setIpfs] = useState<IPFSHTTPClient | undefined>(undefined)
  const openNotification = useNotification()

  useEffect(() => {
    let ipfsClient: IPFSHTTPClient | undefined
    const auth = "Basic " + Buffer.from(INFURA_PROJECT_ID + ":" + INFURA_API_KEY).toString("base64")
    try {
      ipfsClient = create({
        url: "https://ipfs.infura.io:5001/api/v0",
        headers: {
          authorization: auth,
        },
      })
    } catch (error) {
      console.error("IPFS error ", error)
      ipfsClient = undefined
    }
    setIpfs(ipfsClient)
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
            preventDuplicate: true,
          })
        })
        .catch(({ response }) => {
          if (response.data.error.reason !== "DUPLICATE_OBJECT") {
            openNotification({
              message: `Pinning of ${name} failed. [Hash: ${path}]`,
              variant: "error",
              autoHideDuration: 5000,
              preventDuplicate: true,
            })
          }
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

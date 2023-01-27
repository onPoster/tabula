import useLocalStorage from "./useLocalStorage"
import { Pinning } from "../models/pinning"
import axios from "axios"
import { useNotification } from "./useNotification"
import { getClient } from "../services/ipfs"

const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY
if (IPFS_GATEWAY == null) {
  throw new Error("REACT_APP_IPFS_GATEWAY is not set")
}

export const useIpfs = () => {
  const [pinning] = useLocalStorage("pinning", undefined)
  const [ipfsNodeEndpoint] = useLocalStorage("ipfsNodeEndpoint", undefined)
  const openNotification = useNotification()
  // TODO: keeping until we find a better way to handle this
  const getClientHack = async (ipfsNodeEndpoint?: string) => {
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
    let client = await getClient(ipfsNodeEndpoint)

    if (!client) {
      await sleep(1000)
      client = await getClient(ipfsNodeEndpoint)
    }

    if (!client) {
      await sleep(2000)
      client = await getClient(ipfsNodeEndpoint)
    }
    return client
  }

  const uploadContent = async (file: File | string): Promise<{ cid?: any; path: string }> => {
    console.log("uploading content")
    const client = await getClientHack(ipfsNodeEndpoint)

    const result = await client.add(file)
    return {
      cid: result.cid,
      path: result.path,
    }
  }

  const getImgSrc = async (hash: string): Promise<string> => {
    // TODO: this is a workaround. It should use the ipfs http client
    // its contained here for now so it can be changed over to the ipfs http client when we find a good solution for this
    // its set up as a promise on purus as this will be required for the real implementation
    return `${IPFS_GATEWAY}/${hash}`
  }

  const getText = async (hash: string): Promise<string> => {
    const client = await getClientHack(ipfsNodeEndpoint)
    let str = ""
    if (client) {
      const res = client.cat(hash)
      const decoder = new TextDecoder()

      for await (const val of res) {
        str = str + decoder.decode(val)
      }
    }

    return str
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

  return {
    uploadContent,
    pinAction,
    isValidIpfsService,
    getText,
    getImgSrc,
  }
}

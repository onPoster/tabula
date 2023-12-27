import useLocalStorage from "./useLocalStorage"
import { Pinning, PinningService } from "../models/pinning"
import axios from "axios"
import { useNotification } from "./useNotification"
import { getClient } from "../services/ipfs"

const IPFS_GATEWAY = import.meta.env.VITE_APP_IPFS_GATEWAY
const INFURA_IPFS_API_KEY = import.meta.env.VITE_APP_INFURA_IPFS_API_KEY
const INFURA_IPFS_API_KEY_SECRET = import.meta.env.VITE_APP_INFURA_IPFS_API_SECRET

if (IPFS_GATEWAY == null) {
  throw new Error("VITE_APP_IPFS_GATEWAY is not set")
}
if (INFURA_IPFS_API_KEY == null) {
  throw new Error("VITE_APP_INFURA_IPFS_API_KEY is not set")
}
if (INFURA_IPFS_API_KEY_SECRET == null) {
  throw new Error("VITE_APP_INFURA_IPFS_API_SECRET is not set")
}

export interface IpfsFunctions {
  uploadContent: (file: File | string) => Promise<{ cid?: any; path: string }>
  pinAction: (path: string, name: string, msg?: string) => Promise<void>
  isValidIpfsService: (data: Pinning) => Promise<boolean>
  getText: (hash: string) => Promise<string>
  getImgSrc: (hash: string) => Promise<string>
  getImgHash: (path: string, remove: boolean) => string
}

export const useIpfs = (): IpfsFunctions => {
  const [isSelectedHowToSaveArticle] = useLocalStorage<boolean | undefined>("isSelectedHowToSaveArticle", undefined)
  const [pinning] = useLocalStorage<Pinning | undefined>("pinning", undefined)
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

  /**
   * Uploads a file to IPFS and pins it via the Infura API
   * @param {File | string} file - The file or string content to be uploaded to IPFS
   * @returns {Promise<{ cid?: any; path: string } | undefined>} The CID and path of the file in IPFS, or undefined if an error occurs
   */
  const uploadToInfura = async (
    file: File | string,
    pin: boolean,
  ): Promise<{ cid?: any; path: string } | undefined> => {
    const formData = new FormData()
    // Check if 'file' is a string or an instance of File/Blob
    if (typeof file === "string") {
      const blob = new Blob([file], { type: "text/plain" }) // Convert string to Blob
      formData.append("file", blob)
    } else {
      formData.append("file", file)
    }
    const response = await axios.post(`https://ipfs.infura.io:5001/api/v0/add?pin=${pin}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization:
          "Basic " + Buffer.from(`${INFURA_IPFS_API_KEY}:${INFURA_IPFS_API_KEY_SECRET}`).toString("base64"),
      },
    })
    // The returned data contains the CID of the file in IPFS, which is extracted and returned along with the path
    let cid = response.data.Hash
    return {
      cid: cid,
      path: cid,
    }
  }

  /**
   * Uploads a file or string content to IPFS
   * @param {File | string} file - The file or string content to be uploaded to IPFS
   * @returns {Promise<{ cid?: any; path: string }>} The CID and path of the file in IPFS
   */
  const uploadContent = async (file: File | string): Promise<{ cid?: any; path: string }> => {
    console.log("uploading content")
    let result

    if (!pinning || (pinning && pinning?.service === PinningService.PUBLIC)) {
      try {
        result = await uploadToInfura(file, true)
      } catch (infuraError) {
        console.error("Failed to upload file using Infura API:", infuraError)
      }
    }
    if (isSelectedHowToSaveArticle && pinning) {
      try {
        // First attempts to upload the content using the IPFS HTTP client
        const client = await getClientHack(ipfsNodeEndpoint)
        result = await client.add(file)
      } catch (error) {
        console.log("Failed to upload content using IPFS HTTP client:", error)
        // If the upload fails, it attempts to upload the file using the Infura API.
        // This is typically used when the user is using a public IPFS gateway, which does not support generating a CID.
        try {
          result = await uploadToInfura(file, false)
        } catch (infuraError) {
          console.error("Failed to upload file using Infura API:", infuraError)
        }
      }
    }

    return {
      cid: result?.cid ?? "",
      path: result?.path ?? "",
    }
  }

  const getImgSrc = async (hash: string): Promise<string> => {
    // TODO: this is a workaround. It should use the ipfs http client
    // its contained here for now so it can be changed over to the ipfs http client when we find a good solution for this
    // its set up as a promise on purus as this will be required for the real implementation
    return `${IPFS_GATEWAY}/${hash}`
  }

  const removePrefix = (url: string, prefix: string) => {
    if (url.startsWith(prefix)) {
      return url.slice(prefix.length)
    }
    return url
  }

  const getImgHash = (path: string, remove: boolean): string => {
    if (path.includes(IPFS_GATEWAY)) {
      if (remove) {
        return removePrefix(path, IPFS_GATEWAY)
      }
      return path
    }
    return path
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
      if (pinningService.service === PinningService.PUBLIC) {
        //We used infura to pin in the uploadContent method
        return
      }
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
    getImgHash,
  }
}

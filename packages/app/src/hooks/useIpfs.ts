import { useEffect, useState } from "react"
import { create, IPFSHTTPClient } from "ipfs-http-client"
import useLocalStorage from "./useLocalStorage"
import { Pinning } from "../models/pinning"
import axios from "axios"
import { useNotification } from "./useNotification"

const INFURA_PROJECT_ID = process.env.REACT_APP_IPFS_INFURA_PROJECT_ID
if (INFURA_PROJECT_ID == null) {
  throw new Error("REACT_APP_IPFS_INFURA_PROJECT_ID is not set")
}

const INFURA_SECRET_KEY = process.env.REACT_APP_IPFS_INFURA_SECRET_KEY
if (INFURA_PROJECT_ID == null) {
  throw new Error("REACT_APP_IPFS_INFURA_SECRET_KEY is not set")
}

const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY
if (IPFS_GATEWAY == null) {
  throw new Error("REACT_APP_IPFS_GATEWAY is not set")
}

export const useIpfs = () => {
  const [pinning] = useLocalStorage("pinning", undefined)
  const [ipfsNodeEndpoint] = useLocalStorage("ipfsNodeEndpoint", undefined)
  const [ipfs, setIpfs] = useState<IPFSHTTPClient | undefined>(undefined)
  const openNotification = useNotification()
  const [isSettingUp, setIsSettingUp] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const setup = async () => {
      try {
        //We try with the ipfs node provided by the user
        const client = create({ url: ipfsNodeEndpoint ? ipfsNodeEndpoint : "http://localhost:5001/api/v0" })
        if (await client.version()) {
          return setIpfs(client)
        }
      } catch (e) {
        try {
          const auth = "Basic " + Buffer.from(INFURA_PROJECT_ID + ":" + INFURA_SECRET_KEY).toString("base64")
          const client = create({
            host: "ipfs.infura.io",
            port: 5001,
            protocol: "https",
            headers: {
              authorization: auth,
            },
          })
          if (await client.version()) {
            return setIpfs(client)
          }
        } catch (e) {
          throw Error("Unable to connect to a running IPFS node.")
        }
      } finally {
        setIsReady(true)
        setIsSettingUp(false)
      }
    }
    if (ipfs == null && !isSettingUp) {
      setIsSettingUp(true)
      setup()
    }
  }, [ipfs, ipfsNodeEndpoint, isSettingUp])

  const uploadContent = async (file: File | string): Promise<{ cid?: any; path: string }> => {
    const result = await (ipfs as IPFSHTTPClient).add(file)
    return {
      cid: result.cid,
      path: result.path,
    }
  }

  const getImgSrc = async (hash: string): Promise<string> => {
    // TODO: this is a workaround. It should use the ipfs http client
    // its contained here for now so it can be changed over to the ipfs http client when we find a good solution for this
    // its set up as a promise on purus as this will be required for the real implementation
    try {
      const response = await fetch(`${IPFS_GATEWAY}/${hash}`)
      if (response.status === 200) {
        return response.url
      }
      throw Error("Unable to retrieve your image src")
    } catch (e) {
      throw Error("Unable to retrieve your image src")
    }
  }

  const getText = async (hash: string): Promise<string> => {
    const res = await (ipfs as IPFSHTTPClient).cat(hash)
    var decoder = new TextDecoder()
    let str = ""

    for await (const val of res) {
      str = str + decoder.decode(val)
    }
    console.log("str:" + str)

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

  return { ipfs, uploadContent, pinAction, isValidIpfsService, getText, getImgSrc, isReady }
}

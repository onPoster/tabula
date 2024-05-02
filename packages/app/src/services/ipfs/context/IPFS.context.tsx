import { useState } from "react"
import { createGenericContext } from "@/utils/create-generic-context"
import { IPFSContextType, IPFSProviderProps } from "./IPFS.types"
import { Helia, createHelia } from "helia"
import { UnixFS, unixfs } from "@helia/unixfs"
import { LevelBlockstore } from "blockstore-level"
import { libp2pDefaults } from "@/services/ipfs/dataTransmission/libp2p-defaults.browser"
// import { bootstrapConfig } from "@/services/ipfs/dataTransmission/bootstrappers"
import { ImportCandidate, KuboRPCClient, create } from "kubo-rpc-client"
import axios from "axios"

const [useIPFSContext, IPFSContextProvider] = createGenericContext<IPFSContextType>()

const PINATA_ENDPOINT = "https://api.pinata.cloud/pinning/pinByHash"
const INFURA_IPFS_API_KEY = import.meta.env.VITE_APP_INFURA_IPFS_API_KEY
const INFURA_IPFS_API_KEY_SECRET = import.meta.env.VITE_APP_INFURA_IPFS_API_SECRET
const PINATA_API_KEY = import.meta.env.VITE_APP_PINATA_API_KEY
const PINATA_SECRET_API_KEY = import.meta.env.VITE_APP_PINATA_SECRET_API_KEY

if (INFURA_IPFS_API_KEY == null) {
  throw new Error("VITE_APP_INFURA_IPFS_API_KEY is not set")
}
if (INFURA_IPFS_API_KEY_SECRET == null) {
  throw new Error("VITE_APP_INFURA_IPFS_API_SECRET is not set")
}
if (PINATA_API_KEY == null) {
  throw new Error("VITE_APP_PINATA_API_KEY is not set")
}
if (PINATA_SECRET_API_KEY == null) {
  throw new Error("VITE_APP_PINATA_SECRET_API_KEY is not set")
}

const INFURA_AUTH = "Basic " + Buffer.from(`${INFURA_IPFS_API_KEY}:${INFURA_IPFS_API_KEY_SECRET}`).toString("base64")

const IPFSProvider = ({ children }: IPFSProviderProps) => {
  const [helia, setHelia] = useState<Helia | undefined>(undefined)
  const [kuboClientInstance, setKuboClientInstance] = useState<KuboRPCClient | undefined>(undefined)
  const [fs, setFs] = useState<UnixFS | undefined>(undefined)

  const startIpfsClientInstance = async () => {
    try {
      await startClientEncodeInstance()
      await startClientDecodeInstance()
    } catch {
      console.error("Error starting the ipfs clients")
    }
  }

  /**
   * Start helia instance we use it to decode
   */
  const startClientDecodeInstance = async () => {
    if (helia) return console.log("Helia Started")
    try {
      const blockstore = new LevelBlockstore(`helia-example-blockstore`)
      console.log("Starting Helia")
      const heliaInstance = await createHelia({ blockstore, libp2p: libp2pDefaults() })
      const fsInstance = unixfs(heliaInstance)
      setHelia(heliaInstance)
      setFs(fsInstance)
    } catch (error) {
      console.error("Helia creation failed:", error)
      setHelia(undefined)
      setFs(undefined)
    }
  }

  /**
   * Start kubo rpc client instance we use it to encode
   */
  const startClientEncodeInstance = async () => {
    if (kuboClientInstance) return console.log("kuboClientInstance Started")
    try {
      setKuboClientInstance(
        create({
          host: "ipfs.infura.io",
          port: 5001,
          protocol: "https",
          headers: {
            authorization: INFURA_AUTH,
          },
        }),
      )
    } catch (error) {
      console.error("Kubo rpc instance failed:", error)
    }
  }

  /**
   * To decode we use fs instance generated using Helia
   */
  const decodeIpfsHash = async (cid: string): Promise<string> => {
    let text = ""
    if (fs) {
      // this decoder will turn Uint8Arrays into strings
      const decoder = new TextDecoder()
      //@ts-expect-error Error with the types
      for await (const chunk of fs.cat(cid)) {
        text += decoder.decode(chunk, {
          stream: true,
        })
      }
    }
    return text
  }

  /**
   * To encode we use kubo-rpc-client with infura node to generate temp CID
   */
  const encodeIpfsHash = async (content: ImportCandidate): Promise<string | undefined> => {
    if (!kuboClientInstance) return undefined
    const { cid } = await kuboClientInstance.add(content)
    return cid.toV0().toString()
  }

  const publicRemotePin = async (cid: string, fileName: string) => {
    const body = {
      hashToPin: cid,
      pinataMetadata: {
        name: fileName,
      },
    }

    const headers = {
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_API_KEY,
    }
    try {
      const response = await axios.post(PINATA_ENDPOINT, body, { headers })
      console.log("Pinata Response:", response.data)
    } catch (error) {
      console.error("Error pinning the file", error)
    }
  }

  // const encode = async (text: string): Promise<string | undefined> => {
  //   if (!helia) return
  //   if (fs && helia) {
  //     const encoder = new TextEncoder()
  //     try {
  //       //@ts-expect-error
  //       const cid = await fs.addBytes(encoder.encode(text), helia.blockstore)
  //       console.log("cid", cid)
  //       console.log("Added file:", cid.toString())
  //       return cid as any
  //     } catch (e) {
  //       console.error(e)
  //       return
  //     }
  //   }
  // }

  // const pinAction = async (cid: string, name: string) => {
  //   if (helia) {
  //     const remotePinner = createRemotePinner(helia, remotePinningClient)
  //     const addPinResult = await remotePinner
  //       .addPin({
  //         //@ts-expect-error
  //         cid,
  //         name,
  //         //@ts-expect-error
  //         origins: new Set(bootstrapConfig.list),
  //       })
  //       .then((t) => console.log("t.requestedId", t.requestid))
  //     const pins = await remotePinningClient.pinsGet()
  //     console.log("pins", pins)
  //     console.log("addPinResult", addPinResult)
  //     // await getPin("9300fb6d-bae4-4b3b-a68b-8f9c43fca6de")
  //   }
  // }

  return (
    <IPFSContextProvider
      value={{
        helia,
        fs,
        startIpfsClientInstance,
        encodeIpfsHash,
        decodeIpfsHash,
        publicRemotePin,
      }}
    >
      {children}
    </IPFSContextProvider>
  )
}

export { useIPFSContext, IPFSProvider }

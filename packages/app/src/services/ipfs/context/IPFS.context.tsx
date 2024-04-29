import { useState } from "react"
import { createGenericContext } from "../../../utils/create-generic-context"
import { IPFSContextType, IPFSProviderProps } from "./IPFS.types"
import { Helia, createHelia } from "helia"
import { UnixFS, unixfs } from "@helia/unixfs"
import { LevelBlockstore } from "blockstore-level"
import { libp2pDefaults } from "../dataTransmission/libp2p-defaults.browser"
import { Configuration, RemotePinningServiceClient } from "@ipfs-shipyard/pinning-service-client"
import { createRemotePinner } from "@helia/remote-pinning"
import { multiaddr } from "@multiformats/multiaddr"
import { bootstrapConfig } from "../dataTransmission/bootstrappers"

const [useIPFSContext, IPFSContextProvider] = createGenericContext<IPFSContextType>()


const pinServiceConfig = new Configuration({
  endpointUrl: "http://127.0.0.1:5001/api/v0", // the URI for your pinning provider, e.g. `http://localhost:3000`
  // accessToken:
})
// const pinServiceConfig = new Configuration({
//   endpointUrl: "https://api.pinata.cloud/psa", // the URI for your pinning provider, e.g. `http://localhost:3000`
//   accessToken:
// })

const remotePinningClient = new RemotePinningServiceClient(pinServiceConfig)

const IPFSProvider = ({ children }: IPFSProviderProps) => {
  const [helia, setHelia] = useState<Helia | undefined>(undefined)
  const [fs, setFs] = useState<UnixFS | undefined>(undefined)
  const [startingHelia, setStartingHelia] = useState<boolean>(false)

  const startHelia = async () => {
    if (helia) return console.log("Helia Started")
    try {
      setStartingHelia(true)
      const blockstore = new LevelBlockstore(`helia-example-blockstore`)
      console.log("Starting Helia")
      //@ts-expect-error types are borked...
      const heliaInstance = await createHelia({ blockstore, libp2p: libp2pDefaults() })
      const fsInstance = unixfs(heliaInstance)
      setHelia(heliaInstance)
      setFs(fsInstance)
      setStartingHelia(false)
    } catch (error) {
      console.error("Helia creation failed:", error)
      setHelia(undefined)
      setFs(undefined)
      setStartingHelia(false)
    }
  }

  const decodeCID = async (cid: string): Promise<string> => {
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

  const encode = async (text: string): Promise<string | undefined> => {
    if (!helia) return
    if (fs && helia) {
      const encoder = new TextEncoder()
      try {
        //@ts-expect-error
        const cid = await fs.addBytes(encoder.encode(text), helia.blockstore)
        console.log("cid", cid)
        console.log("Added file:", cid.toString())
        return cid as any
      } catch (e) {
        console.error(e)
        return
      }
    }
  }

  const pinAction = async (cid: string, name: string) => {
    if (helia) {
      const remotePinner = createRemotePinner(helia, remotePinningClient)
      const addPinResult = await remotePinner
        .addPin({
          //@ts-expect-error
          cid,
          name,
          origins: new Set(bootstrapConfig.list),
        })
        .then((t) => console.log("t.requestedId", t.requestid))
      const pins = await remotePinningClient.pinsGet()
      console.log("pins", pins)
      console.log("addPinResult", addPinResult)
      // await getPin("9300fb6d-bae4-4b3b-a68b-8f9c43fca6de")
    }
  }
  const getPin = async (requestid: string) => {
    if (helia) {
      const pinResults = await remotePinningClient.pinsRequestidGet({ requestid })
      console.log("pinResults", pinResults)
    }
  }

  return (
    <IPFSContextProvider
      value={{
        helia,
        fs,
        startingHelia,
        startHelia,
        decodeCID,
        encode,
        pinAction,
      }}
    >
      {children}
    </IPFSContextProvider>
  )
}

export { useIPFSContext, IPFSProvider }

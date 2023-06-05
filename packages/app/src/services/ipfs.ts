import * as ipfsCore from "ipfs-core"
import { create, IPFSHTTPClient } from "ipfs-http-client"

type IPFS = IPFSHTTPClient | ipfsCore.IPFS

let client: IPFS
let ipfsNodeEndpointCached: string | undefined

export const getClient = async (ipfsNodeEndpoint?: string): Promise<IPFS> => {
  if (ipfsNodeEndpointCached !== ipfsNodeEndpoint || client == null) {
    ipfsNodeEndpointCached = ipfsNodeEndpoint
    try {
      //We try with the ipfs node provided by the user, if now available we try using the default url for a locale IPFS node
      const ipfsHttpClient = create({ url: ipfsNodeEndpoint ?? "http://localhost:5001/api/v0" })
      if (await ipfsHttpClient.version()) {
        console.log("IPFS getClient: using ipfsHttpClient")
        client = ipfsHttpClient
      } else {
        throw Error("Unable to connect to IPFS node via HTTP client.")
      }
    } catch (ipfsHttpClientError) {
      //If non of the above options are available we spin up a IPFS node in the browser
      try {
        const ipfsBrowser = await ipfsCore.create({ start: true })
        if (ipfsBrowser.isOnline()) {
          console.log("IPFS getClient: using ipfsBrowser")
          client = ipfsBrowser
        } else {
          console.log("IPFS setupClient: ipfsBrowser is not online")
          throw Error("Unable to connect to IPFS node in browser.")
        }
      } catch (ipfsBrowserError) {
        if (ipfsBrowserError instanceof Error && ipfsBrowserError.name === "LockExistsError") {
          // ok!
          console.log("IPFS setupClient: ipfsBrowser is already running")
        } else {
          console.log("IPFS HTTP Client Error:", ipfsHttpClientError)
          console.log("IPFS in Browser Error:", ipfsBrowserError)
          throw Error("Unable to connect to a running IPFS node.")
        }
      }
    }
  }
  return client
}

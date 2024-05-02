import { UnixFS } from "@helia/unixfs"
import { Helia } from "helia"
import { ImportCandidate } from "kubo-rpc-client"
import { ReactNode } from "react"

export type IPFSContextType = {
  helia: Helia | undefined
  fs: UnixFS | undefined
  startIpfsClientInstance: () => Promise<void>
  encodeIpfsHash: (content: ImportCandidate) => Promise<string | undefined>
  decodeIpfsHash: (cid: string) => Promise<string>
  publicRemotePin: (cid: string, fileName: string) => Promise<void>
}

export type IPFSProviderProps = {
  children: ReactNode
}

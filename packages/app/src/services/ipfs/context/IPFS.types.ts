import { Pinning } from "@/models/pinning"
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
  remotePin: (cid: string, fileName: string) => Promise<void>
  checkPinataPinStatus: (cid: string) => Promise<string | undefined>
  generateIPFSImageUrl: (cid: string) => Promise<string>
  isValidIpfsService: (data: Pinning) => Promise<boolean>
}

export type IPFSProviderProps = {
  children: ReactNode
}

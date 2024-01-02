import { UnixFS } from "@helia/unixfs"
import { Helia } from "helia"
import { ReactNode } from "react"

export type IPFSContextType = {
  helia: Helia | undefined
  fs: UnixFS | undefined
  startingHelia: boolean
  startHelia: () => Promise<void>
  decodeCID: (cid: string) => Promise<string>
  encode: (cid: string) => Promise<string | undefined>
  pinAction: (cid: string, name: string) => Promise<void>
}

export type IPFSProviderProps = {
  children: ReactNode
}

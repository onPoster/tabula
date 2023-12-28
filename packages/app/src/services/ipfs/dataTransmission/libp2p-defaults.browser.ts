import { gossipsub } from "@chainsafe/libp2p-gossipsub"
import { noise } from "@chainsafe/libp2p-noise"
import { yamux } from "@chainsafe/libp2p-yamux"
import { createDelegatedRoutingV1HttpApiClient } from "@helia/delegated-routing-v1-http-api-client"
import { autoNAT } from "@libp2p/autonat"
import { bootstrap } from "@libp2p/bootstrap"
import { circuitRelayTransport } from "@libp2p/circuit-relay-v2"
import { dcutr } from "@libp2p/dcutr"
import { type Identify } from "@libp2p/identify"
import { type DualKadDHT, kadDHT } from "@libp2p/kad-dht"
import { KeychainInit, type Keychain } from "@libp2p/keychain"
import { mplex } from "@libp2p/mplex"
import { ping, type PingService } from "@libp2p/ping"
import { webRTC, webRTCDirect } from "@libp2p/webrtc"
import { webSockets } from "@libp2p/websockets"
import { webTransport } from "@libp2p/webtransport"
import { ipnsSelector } from "ipns/selector"
import { ipnsValidator } from "ipns/validator"
import { bootstrapConfig } from "./bootstrappers"
import type { PeerId, PubSub } from "@libp2p/interface"
import type { Libp2pOptions } from "libp2p"
import { ipniContentRouting } from "@libp2p/ipni-content-routing"
export interface Libp2pDefaultsOptions {
  peerId?: PeerId
  keychain?: KeychainInit
}

export interface DefaultLibp2pServices extends Record<string, unknown> {
  autoNAT: unknown
  dcutr: unknown
  delegatedRouting: unknown
  dht: DualKadDHT
  identify: Identify
  keychain: Keychain
  ping: PingService
  pubsub: PubSub
}

export function libp2pDefaults(): Libp2pOptions<DefaultLibp2pServices> {
  return {
    addresses: {
      listen: ["/webrtc"],
    },
    transports: [
      circuitRelayTransport({
        discoverRelays: 1,
      }),
      webRTC(),
      webRTCDirect(),
      webTransport(),
      webSockets(),
    ],
    contentRouters: [ipniContentRouting("https://cid.contact")],
    connectionEncryption: [noise()],
    streamMuxers: [yamux(), mplex()],
    peerDiscovery: [bootstrap(bootstrapConfig)],
    services: {
      autoNAT: autoNAT(),
      dcutr: dcutr(),
      delegatedRouting: () => createDelegatedRoutingV1HttpApiClient("https://delegated-ipfs.dev"),
      dht: kadDHT({
        pingTimeout: 2000,
        pingConcurrency: 3,
        kBucketSize: 20,
        clientMode: true,
        validators: {
          ipns: ipnsValidator,
        },
        selectors: {
          ipns: ipnsSelector,
        },
      }),
      ping: ping(),
      pubsub: gossipsub(),
    },
  }
}

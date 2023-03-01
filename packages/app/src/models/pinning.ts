export interface Pinning {
  service: PinningService
  endpoint: string
  accessToken: string
}

export enum PinningService {
  PINATA = "PINATA",
  ESTUARY = "ESTUARY",
  WEB3_STORAGE = "WEB3_STORAGE",
  NFT_STORAGE = "NFT_STORAGE",
  CUSTOM = "CUSTOM",
}

export enum PinningServiceEndpoint {
  PINATA = "https://api.pinata.cloud/psa",
  ESTUARY = "https://api.estuary.tech/pinning",
  WEB3_STORAGE = "https://api.web3.storage/pins",
  NFT_STORAGE = "https://api.nft.storage/pins",
}

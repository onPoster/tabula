import { createClient, defaultExchanges } from "urql"
import { SupportedChainId } from "../constants/chain"

if (!process.env.REACT_APP_SUBGRAPH_BASE_URL) {
  throw new Error("REACT_APP_SUBGRAPH_BASE_URL is not set")
}
if (!process.env.REACT_APP_SUBGRAPH_GNOSIS_CHAIN) {
  throw new Error("REACT_APP_SUBGRAPH_GNOSIS_CHAIN is not set")
}
if (!process.env.REACT_APP_SUBGRAPH_MAINNET) {
  throw new Error("REACT_APP_SUBGRAPH_MAINNET is not set")
}
if (!process.env.REACT_APP_SUBGRAPH_GOERLI) {
  throw new Error("REACT_APP_SUBGRAPH_GOERLI is not set")
}
// if (!process.env.REACT_APP_SUBGRAPH_SEPOLIA) {
//   throw new Error("REACT_APP_SUBGRAPH_SEPOLIA is not set")
// }
if (!process.env.REACT_APP_SUBGRAPH_POLYGON) {
  throw new Error("REACT_APP_SUBGRAPH_POLYGON is not set")
}
if (!process.env.REACT_APP_SUBGRAPH_ARBITRUM) {
  throw new Error("REACT_APP_SUBGRAPH_ARBITRUM is not set")
}
if (!process.env.REACT_APP_SUBGRAPH_OPTIMISM) {
  throw new Error("REACT_APP_SUBGRAPH_OPTIMISM is not set")
}
if (!process.env.REACT_APP_SUBGRAPH_OPTIMISM_ON_GNOSIS_CHAIN) {
  throw new Error("REACT_APP_SUBGRAPH_OPTIMISM_ON_GNOSIS_CHAIN is not set")
}
if (!process.env.REACT_APP_ENS_SUBGRAPH_MAINNET) {
  throw new Error("REACT_APP_ENS_SUBGRAPH_MAINNET is not set")
}
if (!process.env.REACT_APP_ENS_SUBGRAPH_GOERLI) {
  throw new Error("REACT_APP_ENS_SUBGRAPH_GOERLI is not set")
}

const BASE_SUBGRAPH_URL = process.env.REACT_APP_SUBGRAPH_BASE_URL
const SUBGRAPH_GNOSIS_CHAIN = process.env.REACT_APP_SUBGRAPH_GNOSIS_CHAIN
const SUBGRAPH_MAINNET = process.env.REACT_APP_SUBGRAPH_MAINNET
const SUBGRAPH_GOERLI = process.env.REACT_APP_SUBGRAPH_GOERLI
const SUBGRAPH_SEPOLIA = process.env.REACT_APP_SUBGRAPH_SEPOLIA
const SUBGRAPH_POLYGON = process.env.REACT_APP_SUBGRAPH_POLYGON
const SUBGRAPH_ARBITRUM = process.env.REACT_APP_SUBGRAPH_ARBITRUM
const SUBGRAPH_OPTIMISM = process.env.REACT_APP_SUBGRAPH_OPTIMISM
const SUBGRAPH_OPTIMISM_ON_GNOSIS_CHAIN = process.env.REACT_APP_SUBGRAPH_OPTIMISM_ON_GNOSIS_CHAIN
const ENS_SUBGRAPH_MAINNET = process.env.REACT_APP_ENS_SUBGRAPH_MAINNET
const ENS_SUBGRAPH_GOERLI = process.env.REACT_APP_ENS_SUBGRAPH_GOERLI

const getUrl = (chainId?: number) => {
  switch (chainId) {
    case SupportedChainId.MAINNET:
      return BASE_SUBGRAPH_URL + SUBGRAPH_MAINNET
    case SupportedChainId.GNOSIS_CHAIN:
      return BASE_SUBGRAPH_URL + SUBGRAPH_GNOSIS_CHAIN
    case SupportedChainId.GOERLI:
      return BASE_SUBGRAPH_URL + SUBGRAPH_GOERLI
    case SupportedChainId.SEPOLIA:
      return BASE_SUBGRAPH_URL + SUBGRAPH_SEPOLIA
    case SupportedChainId.POLYGON:
      return BASE_SUBGRAPH_URL + SUBGRAPH_POLYGON
    case SupportedChainId.OPTIMISM:
      return BASE_SUBGRAPH_URL + SUBGRAPH_OPTIMISM
    case SupportedChainId.OPTIMISM_ON_GNOSIS_CHAIN:
      return BASE_SUBGRAPH_URL + SUBGRAPH_OPTIMISM_ON_GNOSIS_CHAIN
    case SupportedChainId.ARBITRUM:
      return BASE_SUBGRAPH_URL + SUBGRAPH_ARBITRUM
    default:
      return BASE_SUBGRAPH_URL + SUBGRAPH_GOERLI
  }
}

const getENSUrl = (chainId?: number) => {
  switch (chainId) {
    case SupportedChainId.MAINNET:
    case SupportedChainId.GNOSIS_CHAIN:
    case SupportedChainId.POLYGON:
    case SupportedChainId.OPTIMISM:
    case SupportedChainId.OPTIMISM_ON_GNOSIS_CHAIN:
    case SupportedChainId.ARBITRUM:
      return BASE_SUBGRAPH_URL + ENS_SUBGRAPH_MAINNET
    case SupportedChainId.GOERLI:
      return BASE_SUBGRAPH_URL + ENS_SUBGRAPH_GOERLI
    default:
      return BASE_SUBGRAPH_URL + ENS_SUBGRAPH_GOERLI
  }
}

export const subgraphClient = (chainId?: number) =>
  createClient({
    url: getUrl(chainId),
    exchanges: [...defaultExchanges],
    fetchOptions: {
      cache: "no-cache",
    },
  })

export const ensSubgraphClient = (chainId?: number) =>
  createClient({
    url: getENSUrl(chainId),
    exchanges: [...defaultExchanges],
    fetchOptions: {
      cache: "no-cache",
    },
  })

import { createClient, defaultExchanges } from "urql"
import { SupportedChainId } from "../constants/chain"

if (!process.env.REACT_APP_SUBGRAPH_BASE_URL) {
  throw new Error("REACT_APP_SUBGRAPH_BASE_URL is not set")
}
if (!process.env.REACT_APP_SUBGRAPH_GNOSIS_CHAIN) {
  throw new Error("REACT_APP_SUBGRAPH_GNOSIS_CHAIN is not set")
}
if (!process.env.REACT_APP_SUBGRAPH_RINKEBY) {
  throw new Error("REACT_APP_SUBGRAPH_RINKEBY is not set")
}
if (!process.env.REACT_APP_SUBGRAPH_MAINNET) {
  throw new Error("REACT_APP_SUBGRAPH_MAINNET is not set")
}

const BASE_SUBGRAPH_URL = process.env.REACT_APP_SUBGRAPH_BASE_URL
const SUBGRAPH_GNOSIS_CHAIN = process.env.REACT_APP_SUBGRAPH_GNOSIS_CHAIN
const SUBGRAPH_RINKEBY = process.env.REACT_APP_SUBGRAPH_RINKEBY
const SUBGRAPH_MAINNET = process.env.REACT_APP_SUBGRAPH_MAINNET

const getUrl = (chainId?: number) => {
  console.log(chainId)
  if (chainId === SupportedChainId.MAINNET) {
    return BASE_SUBGRAPH_URL + SUBGRAPH_MAINNET
  }
  if (chainId === SupportedChainId.GNOSIS_CHAIN) {
    return BASE_SUBGRAPH_URL + SUBGRAPH_GNOSIS_CHAIN
  }
  if (chainId === SupportedChainId.RINKEBY) {
    return BASE_SUBGRAPH_URL + SUBGRAPH_RINKEBY
  } else {
    return BASE_SUBGRAPH_URL + SUBGRAPH_RINKEBY
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

import { createClient } from "urql"

if (!process.env.REACT_APP_API_URL) {
  throw new Error("REACT_APP_API_URL is not set")
}
if (!process.env.REACT_APP_SUBGRAPHS) {
  throw new Error("REACT_APP_SUBGRAPHS is not set")
}

const BASE_URL = process.env.REACT_APP_API_URL
const BASE_SUBGRAPH_URL = process.env.REACT_APP_SUBGRAPHS

export const client = createClient({
  url: BASE_URL,
})
export const subgraphClient = createClient({
  url: BASE_SUBGRAPH_URL,
})

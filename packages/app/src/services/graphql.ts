import { createClient } from "urql"

if (!process.env.REACT_APP_SUBGRAPHS) {
  throw new Error("REACT_APP_SUBGRAPHS is not set")
}

const BASE_SUBGRAPH_URL = process.env.REACT_APP_SUBGRAPHS

export const subgraphClient = createClient({
  url: BASE_SUBGRAPH_URL,
})

import { GraphQLClient } from "graphql-request"

if (!process.env.REACT_APP_API_URL) {
  throw new Error("REACT_APP_API_URL is not set")
}
if (!process.env.REACT_APP_SUBGRAPHS) {
  throw new Error("REACT_APP_SUBGRAPHS is not set")
}

const BASE_URL = process.env.REACT_APP_API_URL
const BASE_SUBGRAPH_URL = process.env.REACT_APP_SUBGRAPHS

export const client = new GraphQLClient(BASE_URL, {
  headers: {
    "content-type": "application/json",
  },
})

export const subgraphClient = new GraphQLClient(BASE_SUBGRAPH_URL, {
  headers: {
    "content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
  },
})

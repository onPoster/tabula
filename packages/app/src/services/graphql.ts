import { GraphQLClient } from "graphql-request"

if (!process.env.REACT_APP_API_URL) {
  throw new Error("REACT_APP_API_URL is not set")
}

const BASE_URL = process.env.REACT_APP_API_URL

export const client = new GraphQLClient(BASE_URL, {
  headers: {
    "content-type": "application/json",
  },
})

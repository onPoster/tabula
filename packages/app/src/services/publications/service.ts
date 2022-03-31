import { Publications } from "../../models/publication"
import { subgraphClient } from "../graphql"
import { GET_PUBLICATION_QUERY } from "./queries"

interface GetPublications {
  publications: Publications[]
}

export const getPublications = async () => {
  const response = await subgraphClient.query<GetPublications>(GET_PUBLICATION_QUERY).toPromise()
  return response.data?.publications
}

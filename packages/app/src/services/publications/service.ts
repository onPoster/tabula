import { Publications } from "../../models/publication"
import { subgraphClient } from "../graphql"
import { GET_PUBLICATIONS_QUERY, GET_PUBLICATION_QUERY } from "./queries"

interface GetPublications {
  publications: Publications[]
}

interface GetPublication {
  publication: Publications
}

export const getPublications = async () => {
  const response = await subgraphClient.query<GetPublications>(GET_PUBLICATIONS_QUERY).toPromise()
  return response.data?.publications
}

export const getPublication = async (id: string) => {
  const response = await subgraphClient.query<GetPublication>(GET_PUBLICATION_QUERY, { id }).toPromise()
  return response.data?.publication
}

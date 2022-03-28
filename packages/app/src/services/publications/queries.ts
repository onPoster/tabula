import { gql } from "graphql-request"

export const GET_PUBLICATION_QUERY = gql`
  query getPublications {
    publications {
      id
      description
      image
      tags
      title
    }
  }
`

import { gql } from "urql"

export const GET_PUBLICATION_QUERY = gql`
  query getPublications {
    publications {
      id
      description
      image
      tags
      title
      permissions {
        id
        address
      }
    }
  }
`

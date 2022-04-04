import { gql } from "urql"

export const GET_PUBLICATIONS_QUERY = gql`
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

export const GET_PUBLICATION_QUERY = gql`
  query getPublication($id: String!) {
    publication(id: $id) {
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

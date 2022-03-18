import { gql } from "graphql-request"

export const GET_PUBLISHERS_QUERY = gql`
  query getPublishers {
    posts {
      id
      publisher
      title
      authors
      tags
      postedOn
      lastUpdated
    }
  }
`

export const GET_PUBLISHER_QUERY = gql`
  query getPublisher($address: String!) {
    posts(where: { publisher: $address }) {
      id
      publisher
      article
      title
      authors
      tags
      postedOn
      lastUpdated
    }
  }
`

export const GET_POST_QUERY = gql`
  query getPost($postId: String!) {
    posts(where: { id: $postId }) {
      id
      publisher
      article
      title
      authors
      tags
      postedOn
      lastUpdated
    }
  }
`

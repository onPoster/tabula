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
        articleCreate
        articleDelete
        articleUpdate
        publicationDelete
        publicationPermissions
        publicationUpdate
      }
      lastUpdated
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
        articleCreate
        articleDelete
        articleUpdate
        publicationDelete
        publicationPermissions
        publicationUpdate
      }
      articles(orderDirection: asc) {
        id
        title
        tags
        poster
        lastUpdated
        postedOn
        image
        authors
        description
        article
        publication {
          title
          image
        }
      }
    }
  }
`

export const GET_ARTICLE_QUERY = gql`
  query getArticle($id: String!) {
    article(id: $id) {
      id
      title
      tags
      poster
      lastUpdated
      postedOn
      image
      authors
      description
      article
      publication {
        title
        image
      }
    }
  }
`

export const GET_ARTICLES_QUERY = gql`
  query getArticle {
    articles {
      id
      title
      tags
      poster
      lastUpdated
      postedOn
      image
      authors
      description
      article
      publication {
        title
        image
      }
    }
  }
`

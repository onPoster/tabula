import { gql } from "urql"

const PERMISSIONS = `
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
`

const PUBLICATION_CONTENT = `
  id
  description
  image
  tags
  title
  lastUpdated
  ${PERMISSIONS}
`

const ARTICLE_CONTENT = `
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
    ${PUBLICATION_CONTENT}
  }
`

const PUBLICATIONS = `
  publications {
    ${PUBLICATION_CONTENT}
  }
`

export const GET_PUBLICATIONS_QUERY = gql`
  query getPublications {
    ${PUBLICATIONS}
  }
`

export const GET_PUBLICATION_QUERY = gql`
  query getPublication($id: String!) {
    publication(id: $id) {
      ${PUBLICATION_CONTENT}
      articles(orderDirection: asc) {
        ${ARTICLE_CONTENT}
      }
    }
  }
`

export const GET_ARTICLE_QUERY = gql`
  query getArticle($id: String!) {
    article(id: $id) {
      ${ARTICLE_CONTENT}
    }
  }
`

export const GET_ARTICLES_QUERY = gql`
  query getArticle {
    articles {
      ${ARTICLE_CONTENT}
    }
  }
`

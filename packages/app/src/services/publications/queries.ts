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
  hash
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
  publications(orderBy: lastUpdated, orderDirection: desc) {
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
  query getArticles($publicationId: ID) {
    articles(where: { publication: $publicationId },orderBy: lastUpdated, orderDirection: desc) {
      ${ARTICLE_CONTENT}
    }
  }
`

import { JSONValue, TypedMap, log } from "@graphprotocol/graph-ts"
import { NewPost } from "../generated/Poster/Poster"
import { Article, Publication, Permission } from "../generated/schema"
import {
  getPermissionId,
  jsonToArrayString,
  jsonToString,
  SUB_ACTION__CREATE,
  SUB_ACTION__DELETE,
  SUB_ACTION__UPDATE,
} from "./utils"
import { store } from "@graphprotocol/graph-ts"

export const getArticleId = (event: NewPost): string =>
  "A-" + event.transaction.hash.toHex() + "-" + event.logIndex.toString()
const ARTICLE_ENTITY_TYPE = "Article"

export function handleArticleAction(subAction: String, content: TypedMap<string, JSONValue>, event: NewPost): void {
  let publicationId = jsonToString(content.get("publicationId"))

  if (subAction == SUB_ACTION__CREATE) {
    let publication = Publication.load(publicationId)
    if (publication == null) {
      log.error("Publication does not exist.", [publicationId])
      return
    }

    const articleId = getArticleId(event)
    const article = new Article(articleId)
    if (publicationId != "") {
      article.publication = publicationId
    }
    article.poster = event.params.user
    article.article = jsonToString(content.get("article"))
    article.title = jsonToString(content.get("title"))
    article.authors = jsonToArrayString(content.get("authors"))
    article.description = jsonToString(content.get("description"))
    article.image = jsonToString(content.get("image"))
    article.tags = jsonToArrayString(content.get("tags"))
    article.postedOn = event.block.timestamp
    article.lastUpdated = event.block.timestamp
    article.save()
    return
  }
  if (subAction == SUB_ACTION__UPDATE) {
    const articleId = jsonToString(content.get("id"))
    const article = Article.load(articleId)

    if (!article) {
      log.info("Trying to update unknown article", [articleId])
      return
    }
    let hasChanges = false
    const theArticle = jsonToString(content.get("article"))
    if (theArticle != "") {
      article.article = theArticle
      hasChanges = true
    }
    const title = jsonToString(content.get("title"))
    if (title != "") {
      article.title = title
      hasChanges = true
    }
    const authors = jsonToArrayString(content.get("authors"))
    if (authors != []) {
      article.authors = authors
      hasChanges = true
    }
    const description = jsonToString(content.get("description"))
    if (description != "") {
      article.description = description
      hasChanges = true
    }
    const image = jsonToString(content.get("image"))
    if (image != "") {
      article.image = image
      hasChanges = true
    }
    const tags = jsonToArrayString(content.get("tags"))
    if (tags != []) {
      article.tags = tags
      hasChanges = true
    }

    if (hasChanges) {
      article.lastUpdated = event.block.timestamp
      article.save()
    }
  }
  if (subAction == SUB_ACTION__DELETE) {
    const articleId = jsonToString(content.get("id"))
    const article = Article.load(articleId)

    if (!article) {
      log.info("Trying to delete unknown article", [articleId])
      return
    }

    store.remove(ARTICLE_ENTITY_TYPE, articleId)
    return
  }
}

import { JSONValue, TypedMap, log } from "@graphprotocol/graph-ts"
import { NewPost } from "../generated/Poster/Poster"
import { Article, Publication, Permission } from "../generated/schema"
import { getPermissionId, jsonToString, SUB_ACTION__CREATE, SUB_ACTION__DELETE } from "./utils"
import { store } from "@graphprotocol/graph-ts"

export const getArticleId = (event: NewPost): string =>
  "A-" + event.transaction.hash.toHex() + "-" + event.logIndex.toString()
const ARTICLE_ENTITY_TYPE = "Article"

export function handleArticleAction(subAction: String, content: TypedMap<string, JSONValue>, event: NewPost): void {
  let publicationId = jsonToString(content.get("publicationId"))

  if (subAction == SUB_ACTION__CREATE) {
    const articleId = getArticleId(event)
    const article = new Article(articleId)
    if (publicationId != "") {
      article.publication = publicationId
    }
    article.poster = event.params.user
    article.article = jsonToString(content.get("article"))
    article.title = jsonToString(content.get("title"))
    article.postedOn = event.block.timestamp
    article.lastUpdated = event.block.timestamp
    article.save()
    return
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

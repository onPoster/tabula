import { JSONValue, TypedMap } from "@graphprotocol/graph-ts"
import { NewPost } from "../generated/Poster/Poster"
import { Article } from "../generated/schema"
import { jsonToString } from "./utils"
import { store } from "@graphprotocol/graph-ts"

export const getArticleId = (event: NewPost): string => event.transaction.hash.toHex() + "-" + event.logIndex.toString()
const ARTICLE_ENTITY_TYPE = "Article"

export function handleArticleAction(subAction: String, content: TypedMap<string, JSONValue>, event: NewPost): void {
  if (subAction == "create") {
    const articleId = getArticleId(event)
    const article = new Article(articleId)
    article.poster = event.address
    article.article = jsonToString(content.get("article"))
    article.title = jsonToString(content.get("title"))
    article.postedOn = event.block.timestamp
    article.lastUpdated = event.block.timestamp
    article.save()
  }
  if (subAction == "delete") {
    const articleId = jsonToString(content.get("id"))
    store.remove(ARTICLE_ENTITY_TYPE, articleId)
  }
}

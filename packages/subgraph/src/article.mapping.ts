import { JSONValue, TypedMap, log } from "@graphprotocol/graph-ts"
import { NewPost } from "../generated/Poster/Poster"
import { Article, Publication, Permission } from "../generated/schema"
import { getPermissionId, jsonToString } from "./utils"
import { store } from "@graphprotocol/graph-ts"

export const getArticleId = (event: NewPost): string =>
  "A-" + event.transaction.hash.toHex() + "-" + event.logIndex.toString()
const ARTICLE_ENTITY_TYPE = "Article"

export function handleArticleAction(subAction: String, content: TypedMap<string, JSONValue>, event: NewPost): void {
  if (subAction == "create") {
    const publicationId = jsonToString(content.get("publicationId"))
    const articleId = getArticleId(event)
    const article = new Article(articleId)
    if (publicationId != "") {
      const publication = Publication.load(publicationId)
      if (!publication) {
        log.warning("Publication does not exist.", [publicationId])
        return
      }
      const permissionId = getPermissionId(publicationId, event.params.user)
      const permission = Permission.load(permissionId)
      if (!permission) {
        log.warning(
          "The user does not have permission to post an article to this publication (no permissions set for" +
            "this user in this publication).",
          [permissionId, event.params.user.toHex()],
        )
        return
      }
      if (permission.articleCreate == false) {
        log.warning("The user does not have permission to post an article to this publication.", [
          permissionId,
          event.params.user.toHex(),
        ])
        return
      }
      article.publication = publicationId
    }
    article.poster = event.params.user
    article.article = jsonToString(content.get("article"))
    article.title = jsonToString(content.get("title"))
    article.postedOn = event.block.timestamp
    article.lastUpdated = event.block.timestamp
    article.save()
  }
  if (subAction == "delete") {
    const articleId = jsonToString(content.get("id"))
    const article = Article.load(articleId)

    if (!article) {
      log.info("Trying to delete unknown article", [articleId])
      return
    }

    if (event.params.user != article.poster) {
      log.warning("The user is unauthorized to delete the article.", [
        articleId,
        event.params.user.toHex(),
        article.poster.toHex(),
      ])
      return
    }
    store.remove(ARTICLE_ENTITY_TYPE, articleId)
  }
}

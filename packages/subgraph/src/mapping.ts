import { BigInt, Bytes, crypto, ipfs, JSONValue } from "@graphprotocol/graph-ts"
import { Poster, NewPost } from "../generated/Poster/Poster"
import { Article } from "../generated/schema"
import { json, JSONValueKind } from "@graphprotocol/graph-ts"
import { jsonToString, jsonToArrayString, getActionType } from "./utils"

const PUBLICATION_TAG = "PUBLICATION"

const getArticleId = (event: NewPost): string => event.transaction.hash.toHex() + "-" + event.logIndex.toString()

export function handleNewPost(event: NewPost): void {
  if (event.params.tag.toString() !== PUBLICATION_TAG) {
    // event is not related to publications
    return
  }
  const contentData = json.try_fromString(event.params.content)
  if (contentData.isError) {
    // decode json content, fail gracefully.
    return
  }
  const actionType = getActionType(contentData.value)

  switch (actionType[0]) {
    case "article":
      break
    case "publication":
      break
    default: {
      // unknown action
      return
    }
  }

  const articleId = getArticleId(event)
  // Load post entity
  let post = Article.load(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
  // create new entity if it doesn't already exist
  if (!post) {
    post = new Article(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
  }
  // Set user
  post.poster = event.params.user

  // Fetch article article from IPFS, fail gracefully.
  let article = ipfs.cat(jsonToString(content.get("article")))
  if (!article) {
    post.article = jsonToString(content.get("article"))
  } else {
    post.article = article.toString()
  }

  // Set article
  // post.article = jsonToString(content.get("article"));

  // Set authors
  post.authors = jsonToArrayString(content.get("authors"))

  // Set postedOn timestamp
  post.postedOn = event.block.timestamp

  // Set lastUpdated timestamp
  post.lastUpdated = event.block.timestamp

  // Set tags
  post.tags = jsonToArrayString(content.get("tags"))

  // Set title
  post.title = jsonToString(content.get("title"))

  // Set description
  post.description = jsonToString(content.get("description"))

  // Set image
  post.image = jsonToString(content.get("image"))

  // Safe updates to store
  post.save()
}

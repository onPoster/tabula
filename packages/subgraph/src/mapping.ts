import { BigInt, Bytes, crypto, ipfs } from "@graphprotocol/graph-ts"
import { Poster, NewPost } from "../generated/Poster/Poster"
import { Post } from "../generated/schema"
import { json, JSONValueKind } from "@graphprotocol/graph-ts"
import { jsonToString, jsonToArrayString } from "./utils"

export function handleNewPost(event: NewPost): void {
  // decode json content, fail gracefully.
  let contentData = json.try_fromString(event.params.content)
  if (contentData.isError) {
    return
  }
  let content = contentData.value.toObject()

  // Load post entity
  let post = Post.load(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
  // create new entity if it doesn't already exist
  if (!post) {
    post = new Post(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
  }
  // Set user
  post.publisher = event.params.user

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

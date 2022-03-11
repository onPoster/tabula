import { BigInt, Bytes, crypto, ipfs, json, JSONValue } from "@graphprotocol/graph-ts"
import { Poster, NewPost } from "../generated/Poster/Poster"
import { Article } from "../generated/schema"
import { getActionType } from "./utils"
import { handleArticleAction } from "./article.mapping"

// keccak256 hash of "PUBLICATION"
const PUBLICATION_TAG = "PUBLICATION"

export function handleNewPost(event: NewPost): void {
  // TODO:
  // if (event.params.tag.toString() != PUBLICATION_TAG) {
  // // event is not related to publications
  // return
  // }
  const contentData = json.try_fromString(event.params.content)
  if (contentData.isError) {
    // decode json content, fail gracefully.
    return
  }
  const actionType = getActionType(contentData.value)
  if (actionType[0] == "article") {
    handleArticleAction(actionType[1], contentData.value.toObject(), event)
  } else if (actionType[0] == "publication ") {
  }
}

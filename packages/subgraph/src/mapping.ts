import { BigInt, Bytes, crypto, ipfs, json, JSONValue, log } from "@graphprotocol/graph-ts"
import { Poster, NewPost } from "../generated/Poster/Poster"
import { Article } from "../generated/schema"

import { jsonToString, jsonToArrayString, getActionType } from "./utils"
import * as ArticleActions from "../typings/ArticleAction"
import { handleArticleAction } from "./article.mapping"

// keccak256 hash of "PUBLICATION"
const PUBLICATION_TAG = "0x1d2f2ddf66fd037a52a179e4e4fca655871584011016b01fc2dfc39cc1e2bb62"

export function handleNewPost(event: NewPost): void {
  // if (event.params.tag.toHex() !== PUBLICATION_TAG) {
  // event is not related to publications
  //   return
  // }
  const contentData = json.try_fromString(event.params.content)
  if (contentData.isError) {
    // decode json content, fail gracefully.
    return
  }
  const actionType = getActionType(contentData.value)
  if (actionType[0] === "article") {
    handleArticleAction(actionType[1], contentData.value.toObject(), event)
  } else if (actionType[0] === "publication ") {
  }
}

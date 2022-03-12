import { Address } from "@graphprotocol/graph-ts"
import {
  assert,
  createMockedFunction,
  clearStore,
  test,
  newMockEvent,
  newMockCall,
  countEntities,
} from "matchstick-as/assembly/index"
import { getArticleId } from "../src/article.mapping"
import { handleNewPost } from "../src/mapping"
import { getPublicationId } from "../src/publication.mapping"
import { createNewPostEvent } from "./util"
const PUBLICATION_ENTITY_TYPE = "Publication"
const PUBLICATION_TAG = "0x1d2f2ddf66fd037a52a179e4e4fca655871584011016b01fc2dfc39cc1e2bb62" // keccak-256 of PUBLICATION

test("An account can can create a publication", () => {
  const user = Address.fromString("0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7")
  const action = "publication/create"
  const title = "My First Publication"
  const content = `{
    "action": "${action}",
    "title": "${title}"
  }`

  const newPostEvent = createNewPostEvent(user, content, PUBLICATION_TAG)
  const articleId = getPublicationId(newPostEvent)
  handleNewPost(newPostEvent)

  assert.fieldEquals(PUBLICATION_ENTITY_TYPE, articleId, "title", title)
  assert.notInStore(PUBLICATION_ENTITY_TYPE, articleId + "_fake")
  clearStore()
})

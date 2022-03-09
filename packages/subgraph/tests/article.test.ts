import { Address, ethereum, json } from "@graphprotocol/graph-ts"
import {
  assert,
  createMockedFunction,
  clearStore,
  test,
  newMockEvent,
  newMockCall,
  countEntities,
} from "matchstick-as/assembly/index"
import { handleNewPost } from "../src/mapping"
import { createNewPostEvent } from "./util"
let ARTICLE_ENTITY_TYPE = "Article"

test("Can create a new article without a publication", () => {
  const tag = "PUBLICATION"
  const user = Address.fromString("0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7")
  const action = "article/create"
  const title = "My First Blog Post"
  const content = `{
    action: "${action}",
    article: "QmbtLeBCvT1FW1Kr1JdFCPAgsVsgowg3zMJQS8eFrwPP2j",
    title: "${title}",
  }`

  const newPostEvent = createNewPostEvent(user, content, tag)
  const articleId = newPostEvent.transaction.hash.toHex() + "-" + newPostEvent.logIndex.toString()

  handleNewPost(newPostEvent)

  assert.fieldEquals(ARTICLE_ENTITY_TYPE, articleId, "title", title)
  clearStore()
})

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
import { createNewPostEvent } from "./util"
const ARTICLE_ENTITY_TYPE = "Article"

test("Can create a new article without a publication", () => {
  const tag = "PUBLICATION"
  const user = Address.fromString("0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7")
  const action = "article/create"
  const title = "My First Blog Post"
  const article = "QmbtLeBCvT1FW1Kr1JdFCPAgsVsgowg3zMJQS8eFrwPP2j"
  const content = `{
    "action": "${action}",
    "article": "${article}",
    "title": "${title}"
  }`

  const newPostEvent = createNewPostEvent(user, content, tag)
  const articleId = getArticleId(newPostEvent)
  handleNewPost(newPostEvent)

  assert.fieldEquals(ARTICLE_ENTITY_TYPE, articleId, "title", title)
  assert.fieldEquals(ARTICLE_ENTITY_TYPE, articleId, "article", article)
  assert.notInStore(ARTICLE_ENTITY_TYPE, articleId + "_fake")
  clearStore()
})

test("Can delete a new article", () => {
  const tag = "PUBLICATION"
  const user = Address.fromString("0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7")
  const title = "My First Blog Post"
  const article = "QmbtLeBCvT1FW1Kr1JdFCPAgsVsgowg3zMJQS8eFrwPP2j"
  const createArticleContent = `{
    "action": "article/create",
    "article": "${article}",
    "title": "${title}"
  }`

  const createArticlePostEvent = createNewPostEvent(user, createArticleContent, tag)
  const articleId = getArticleId(createArticlePostEvent)
  handleNewPost(createArticlePostEvent)

  // check that the article is in the store
  assert.fieldEquals(ARTICLE_ENTITY_TYPE, articleId, "title", title)
  assert.fieldEquals(ARTICLE_ENTITY_TYPE, articleId, "article", article)

  const deleteArticleContent = `{
    "action": "article/delete",
    "id": "${articleId}"
  }`

  const newPostEvent = createNewPostEvent(user, deleteArticleContent, tag)
  handleNewPost(newPostEvent)

  // check the article is deleted from the store
  assert.notInStore(ARTICLE_ENTITY_TYPE, articleId)
  clearStore()
})

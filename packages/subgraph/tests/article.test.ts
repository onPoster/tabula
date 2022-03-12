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
const PUBLICATION_TAG = "0x1d2f2ddf66fd037a52a179e4e4fca655871584011016b01fc2dfc39cc1e2bb62" // keccak-256 of PUBLICATION

test("An account can an create a standalone article", () => {
  const user = Address.fromString("0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7")
  const action = "article/create"
  const title = "My First Blog Post"
  const article = "QmbtLeBCvT1FW1Kr1JdFCPAgsVsgowg3zMJQS8eFrwPP2j"
  const content = `{
    "action": "${action}",
    "article": "${article}",
    "title": "${title}"
  }`

  const newPostEvent = createNewPostEvent(user, content, PUBLICATION_TAG)
  const articleId = getArticleId(newPostEvent)
  handleNewPost(newPostEvent)

  assert.fieldEquals(ARTICLE_ENTITY_TYPE, articleId, "title", title)
  assert.fieldEquals(ARTICLE_ENTITY_TYPE, articleId, "article", article)
  assert.notInStore(ARTICLE_ENTITY_TYPE, articleId + "_fake")
  clearStore()
})

test("An account can delete a standalone article that it has created", () => {
  const user = Address.fromString("0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7")
  const title = "My First Blog Post"
  const article = "QmbtLeBCvT1FW1Kr1JdFCPAgsVsgowg3zMJQS8eFrwPP2j"
  const createArticleContent = `{
    "action": "article/create",
    "article": "${article}",
    "title": "${title}"
  }`

  const createArticlePostEvent = createNewPostEvent(user, createArticleContent, PUBLICATION_TAG)
  const articleId = getArticleId(createArticlePostEvent)
  handleNewPost(createArticlePostEvent)

  // check that the article is in the store
  assert.fieldEquals(ARTICLE_ENTITY_TYPE, articleId, "title", title)
  assert.fieldEquals(ARTICLE_ENTITY_TYPE, articleId, "article", article)

  const deleteArticleContent = `{
    "action": "article/delete",
    "id": "${articleId}"
  }`

  const newPostEvent = createNewPostEvent(user, deleteArticleContent, PUBLICATION_TAG)
  handleNewPost(newPostEvent)

  // check the article is deleted from the store
  assert.notInStore(ARTICLE_ENTITY_TYPE, articleId)
  clearStore()
})

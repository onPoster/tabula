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
import { ARTICLE_ENTITY_TYPE, createNewPostEvent, PUBLICATION_TAG } from "./util"

test("An account can create a standalone article", () => {
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

test("An account can NOT delete a standalone article that is created by another account", () => {
  const messageSender = Address.fromString("0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7")
  const title = "My First Blog Post"
  const article = "QmbtLeBCvT1FW1Kr1JdFCPAgsVsgowg3zMJQS8eFrwPP2j"
  const createArticleContent = `{
    "action": "article/create",
    "article": "${article}",
    "title": "${title}"
  }`

  const createArticlePostEvent = createNewPostEvent(messageSender, createArticleContent, PUBLICATION_TAG)
  const articleId = getArticleId(createArticlePostEvent)
  handleNewPost(createArticlePostEvent)

  // check that the article is in the store
  assert.fieldEquals(ARTICLE_ENTITY_TYPE, articleId, "title", title)
  assert.fieldEquals(ARTICLE_ENTITY_TYPE, articleId, "article", article)

  const deleteArticleContent = `{
    "action": "article/delete",
    "id": "${articleId}"
  }`

  const anotherMessageSender = Address.fromString("0xD028d504316FEc029CFa36bdc3A8f053F6E5a6e4")

  const newPostEvent = createNewPostEvent(anotherMessageSender, deleteArticleContent, PUBLICATION_TAG)
  handleNewPost(newPostEvent)

  // check the article is NOT deleted
  assert.fieldEquals(ARTICLE_ENTITY_TYPE, articleId, "title", title)
  assert.fieldEquals(ARTICLE_ENTITY_TYPE, articleId, "article", article)

  clearStore()
})

test("An account can update a standalone article that it has created", () => {
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

  const updatedTitle = "My First Edited Blog Post"
  const updatedArticle = "fake_BCvT1FW1Kr1JdFCPAgsVsgowg3zMJQS8eFrwPP2j"

  const updateArticleContent = `{
    "action": "article/update",
    "id": "${articleId}",
    "article": "${updatedArticle}",
    "title": "${updatedTitle}"
  }`

  const newUpdatePostEvent = createNewPostEvent(user, updateArticleContent, PUBLICATION_TAG)
  handleNewPost(newUpdatePostEvent)

  // check that the article is updated
  assert.fieldEquals(ARTICLE_ENTITY_TYPE, articleId, "title", updatedTitle)
  assert.fieldEquals(ARTICLE_ENTITY_TYPE, articleId, "article", updatedArticle)

  clearStore()
})

test("An account can NOT update a standalone article that it has NOT created", () => {
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

  const updatedTitle = "My First Edited Blog Post"
  const updatedArticle = "fake_BCvT1FW1Kr1JdFCPAgsVsgowg3zMJQS8eFrwPP2j"

  const updateArticleContent = `{
    "action": "article/update",
    "id": "${articleId}",
    "article": "${updatedArticle}",
    "title": "${updatedTitle}"
  }`

  const otherUser = Address.fromString("0xD028d504316FEc029CFa36bdc3A8f053F6E5a6e4")
  const newUpdatePostEvent = createNewPostEvent(otherUser, updateArticleContent, PUBLICATION_TAG)
  handleNewPost(newUpdatePostEvent)

  // check that the article is NOT updated
  assert.fieldEquals(ARTICLE_ENTITY_TYPE, articleId, "title", title)
  assert.fieldEquals(ARTICLE_ENTITY_TYPE, articleId, "article", article)

  clearStore()
})

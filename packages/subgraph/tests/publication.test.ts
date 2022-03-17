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
import { ARTICLE_ENTITY_TYPE, createNewPostEvent, PUBLICATION_ENTITY_TYPE, PUBLICATION_TAG } from "./util"

test("An account can can create a publication", () => {
  const user = Address.fromString("0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7")
  const action = "publication/create"
  const title = "My First Publication"
  const tags = ["test", "cool", "fun"]
  const description = "This is a description"
  const image = "QmaeaxgajiKcT9kiLKrxT6ss6uNg7fg4NkxVvX19utb9Gj"
  const content = `{
    "action": "${action}",
    "title": "${title}",
    "tags": "${tags}",
    "description": "${description}",
    "image": "${image}"
  }`

  const newPostEvent = createNewPostEvent(user, content, PUBLICATION_TAG)
  const articleId = getPublicationId(newPostEvent)
  handleNewPost(newPostEvent)

  assert.fieldEquals(PUBLICATION_ENTITY_TYPE, articleId, "title", title)
  assert.fieldEquals(PUBLICATION_ENTITY_TYPE, articleId, "description", description)
  assert.fieldEquals(PUBLICATION_ENTITY_TYPE, articleId, "image", image)
  assert.notInStore(PUBLICATION_ENTITY_TYPE, articleId + "_fake")
  clearStore()
})

test("An account can create a article in a publication (where the account has `article/create` permissions)", () => {
  const user = Address.fromString("0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7")
  const publicationTitle = "My First Publication"
  const publicationContent = `{
    "action": "publication/create",
    "title": "${publicationTitle}"
  }`

  const newPublicationPostEvent = createNewPostEvent(user, publicationContent, PUBLICATION_TAG)
  const publicationId = getPublicationId(newPublicationPostEvent)
  handleNewPost(newPublicationPostEvent)

  assert.fieldEquals(PUBLICATION_ENTITY_TYPE, publicationId, "title", publicationTitle)
  assert.fieldEquals(PUBLICATION_ENTITY_TYPE, publicationId, "id", publicationId)

  const articleTitle = "My First Blog Post"
  const article = "QmbtLeBCvT1FW1Kr1JdFCPAgsVsgowg3zMJQS8eFrwPP2j"
  const articleContent = `{
    "action": "article/create",
    "publicationId": "${publicationId}",
    "article": "${article}",
    "title": "${articleTitle}"
  }`

  const newArticlePostEvent = createNewPostEvent(user, articleContent, PUBLICATION_TAG)
  const articleId = getArticleId(newArticlePostEvent)
  handleNewPost(newArticlePostEvent)

  assert.fieldEquals(ARTICLE_ENTITY_TYPE, articleId, "title", articleTitle)
  assert.fieldEquals(ARTICLE_ENTITY_TYPE, articleId, "article", article)
  assert.fieldEquals(ARTICLE_ENTITY_TYPE, articleId, "publication", publicationId)

  assert.notInStore(ARTICLE_ENTITY_TYPE, articleId + "_fake")

  clearStore()
})

test("An account can delete an article in a publication (where the account has `article/delete` permissions)", () => {
  const user = Address.fromString("0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7")
  const publicationTitle = "My First Publication"
  const publicationContent = `{
    "action": "publication/create",
    "title": "${publicationTitle}"
  }`

  const newPublicationPostEvent = createNewPostEvent(user, publicationContent, PUBLICATION_TAG)
  const publicationId = getPublicationId(newPublicationPostEvent)
  handleNewPost(newPublicationPostEvent)

  assert.fieldEquals(PUBLICATION_ENTITY_TYPE, publicationId, "id", publicationId)

  const articleTitle = "My First Blog Post"
  const article = "QmbtLeBCvT1FW1Kr1JdFCPAgsVsgowg3zMJQS8eFrwPP2j"
  const articleContent = `{
    "action": "article/create",
    "publicationId": "${publicationId}",
    "article": "${article}",
    "title": "${articleTitle}"
  }`

  const newArticlePostEvent = createNewPostEvent(user, articleContent, PUBLICATION_TAG)
  const articleId = getArticleId(newArticlePostEvent)
  handleNewPost(newArticlePostEvent)

  assert.fieldEquals(ARTICLE_ENTITY_TYPE, articleId, "title", articleTitle)

  const articleDeleteContent = `{
    "action": "article/delete",
    "id": "${articleId}"
  }`

  const newArticleDeletePostEvent = createNewPostEvent(user, articleDeleteContent, PUBLICATION_TAG)
  handleNewPost(newArticleDeletePostEvent)

  assert.notInStore(ARTICLE_ENTITY_TYPE, articleId)

  clearStore()
})

test("An account can NOT an delete an article in a publication (where the account do NOT have `article/delete` permissions)", () => {
  const user = Address.fromString("0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7")
  const publicationTitle = "My First Publication"
  const publicationContent = `{
    "action": "publication/create",
    "title": "${publicationTitle}"
  }`

  const newPublicationPostEvent = createNewPostEvent(user, publicationContent, PUBLICATION_TAG)
  const publicationId = getPublicationId(newPublicationPostEvent)
  handleNewPost(newPublicationPostEvent)

  assert.fieldEquals(PUBLICATION_ENTITY_TYPE, publicationId, "id", publicationId)

  const articleTitle = "My First Blog Post"
  const article = "QmbtLeBCvT1FW1Kr1JdFCPAgsVsgowg3zMJQS8eFrwPP2j"
  const articleContent = `{
    "action": "article/create",
    "publicationId": "${publicationId}",
    "article": "${article}",
    "title": "${articleTitle}"
  }`

  const newArticlePostEvent = createNewPostEvent(user, articleContent, PUBLICATION_TAG)
  const articleId = getArticleId(newArticlePostEvent)
  handleNewPost(newArticlePostEvent)

  assert.fieldEquals(ARTICLE_ENTITY_TYPE, articleId, "title", articleTitle)

  const otherUser = Address.fromString("0xD028d504316FEc029CFa36bdc3A8f053F6E5a6e4")
  const articleDeleteContent = `{
    "action": "article/delete",
    "id": "${articleId}"
  }`

  const newArticleDeletePostEvent = createNewPostEvent(otherUser, articleDeleteContent, PUBLICATION_TAG)
  handleNewPost(newArticleDeletePostEvent)

  // check that the article is not deleted
  assert.fieldEquals(ARTICLE_ENTITY_TYPE, articleId, "title", articleTitle)

  clearStore()
})

test("An account can update an article in a publication where the account has `article/update` permissions", () => {
  const user = Address.fromString("0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7")
  const publicationTitle = "My First Publication"
  const publicationContent = `{
    "action": "publication/create",
    "title": "${publicationTitle}"
  }`

  const newPublicationPostEvent = createNewPostEvent(user, publicationContent, PUBLICATION_TAG)
  const publicationId = getPublicationId(newPublicationPostEvent)
  handleNewPost(newPublicationPostEvent)

  assert.fieldEquals(PUBLICATION_ENTITY_TYPE, publicationId, "id", publicationId)

  const articleTitle = "My First Blog Post"
  const article = "QmbtLeBCvT1FW1Kr1JdFCPAgsVsgowg3zMJQS8eFrwPP2j"
  const articleContent = `{
    "action": "article/create",
    "publicationId": "${publicationId}",
    "article": "${article}",
    "title": "${articleTitle}"
  }`

  const newArticlePostEvent = createNewPostEvent(user, articleContent, PUBLICATION_TAG)
  const articleId = getArticleId(newArticlePostEvent)
  handleNewPost(newArticlePostEvent)

  assert.fieldEquals(ARTICLE_ENTITY_TYPE, articleId, "title", articleTitle)
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

test("An account can NOT update an article in a publication where the account has does not have any permissions", () => {
  const user = Address.fromString("0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7")
  const publicationTitle = "My First Publication"
  const publicationContent = `{
    "action": "publication/create",
    "title": "${publicationTitle}"
  }`

  const newPublicationPostEvent = createNewPostEvent(user, publicationContent, PUBLICATION_TAG)
  const publicationId = getPublicationId(newPublicationPostEvent)
  handleNewPost(newPublicationPostEvent)

  assert.fieldEquals(PUBLICATION_ENTITY_TYPE, publicationId, "id", publicationId)

  const articleTitle = "My First Blog Post"
  const article = "QmbtLeBCvT1FW1Kr1JdFCPAgsVsgowg3zMJQS8eFrwPP2j"
  const articleContent = `{
    "action": "article/create",
    "publicationId": "${publicationId}",
    "article": "${article}",
    "title": "${articleTitle}"
  }`

  const newArticlePostEvent = createNewPostEvent(user, articleContent, PUBLICATION_TAG)
  const articleId = getArticleId(newArticlePostEvent)
  handleNewPost(newArticlePostEvent)

  assert.fieldEquals(ARTICLE_ENTITY_TYPE, articleId, "title", articleTitle)
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

  // check that the article is updated
  assert.fieldEquals(ARTICLE_ENTITY_TYPE, articleId, "title", articleTitle)
  assert.fieldEquals(ARTICLE_ENTITY_TYPE, articleId, "article", article)

  clearStore()
})

test("An account can update a publication where the account has `publication/update` permissions", () => {
  const user = Address.fromString("0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7")
  const publicationTitle = "My First Publication"
  const publicationContent = `{
    "action": "publication/create",
    "title": "${publicationTitle}"
  }`

  const newPublicationPostEvent = createNewPostEvent(user, publicationContent, PUBLICATION_TAG)
  const publicationId = getPublicationId(newPublicationPostEvent)
  handleNewPost(newPublicationPostEvent)

  assert.fieldEquals(PUBLICATION_ENTITY_TYPE, publicationId, "title", publicationTitle)
  assert.fieldEquals(PUBLICATION_ENTITY_TYPE, publicationId, "id", publicationId)

  const newPublicationTitle = "My First Edited Publication"
  const newPublicationDescription = "This is actually the first description for this publication."
  const publicationUpdate = `{
    "action": "publication/update",
    "id": "${publicationId}",
    "title": "${newPublicationTitle}",
    "description": "${newPublicationDescription}"
  }`

  const newPublicationUpdatePostEvent = createNewPostEvent(user, publicationUpdate, PUBLICATION_TAG)
  handleNewPost(newPublicationUpdatePostEvent)

  assert.fieldEquals(PUBLICATION_ENTITY_TYPE, publicationId, "title", newPublicationTitle)
  assert.fieldEquals(PUBLICATION_ENTITY_TYPE, publicationId, "description", newPublicationDescription)

  clearStore()
})

test("An account can NOT update a publication where the account does not have `publication/update` permissions", () => {
  const user = Address.fromString("0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7")
  const publicationTitle = "My First Publication"
  const publicationContent = `{
    "action": "publication/create",
    "title": "${publicationTitle}"
  }`

  const newPublicationPostEvent = createNewPostEvent(user, publicationContent, PUBLICATION_TAG)
  const publicationId = getPublicationId(newPublicationPostEvent)
  handleNewPost(newPublicationPostEvent)

  assert.fieldEquals(PUBLICATION_ENTITY_TYPE, publicationId, "title", publicationTitle)
  assert.fieldEquals(PUBLICATION_ENTITY_TYPE, publicationId, "id", publicationId)

  const newPublicationTitle = "My First Edited Publication"
  const newPublicationDescription = "This is actually the first description for this publication."
  const publicationUpdate = `{
    "action": "publication/update",
    "id": "${publicationId}",
    "title": "${newPublicationTitle}",
    "description": "${newPublicationDescription}"
  }`

  const otherUser = Address.fromString("0xD028d504316FEc029CFa36bdc3A8f053F6E5a6e4")
  const newPublicationUpdatePostEvent = createNewPostEvent(otherUser, publicationUpdate, PUBLICATION_TAG)
  handleNewPost(newPublicationUpdatePostEvent)

  assert.fieldEquals(PUBLICATION_ENTITY_TYPE, publicationId, "title", publicationTitle)
  assert.fieldEquals(PUBLICATION_ENTITY_TYPE, publicationId, "id", publicationId)

  clearStore()
})

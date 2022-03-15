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

test("An account can an create a article in a publication (where the account has `article/create` permissions)", () => {
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

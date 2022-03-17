import { JSONValue, log, TypedMap } from "@graphprotocol/graph-ts"
import { NewPost } from "../generated/Poster/Poster"
import { Permission, Publication } from "../generated/schema"
import {
  getPermissionId,
  jsonToArrayString,
  jsonToString,
  SUB_ACTION__CREATE,
  SUB_ACTION__DELETE,
  SUB_ACTION__UPDATE,
} from "./utils"
import { store } from "@graphprotocol/graph-ts"

export const getPublicationId = (event: NewPost): string =>
  "P-" + event.transaction.hash.toHex() + "-" + event.logIndex.toString()
const PUBLICATION_ENTITY_TYPE = "Publication"

export function handlePublicationAction(subAction: String, content: TypedMap<string, JSONValue>, event: NewPost): void {
  if (subAction == SUB_ACTION__CREATE) {
    const publicationId = getPublicationId(event)

    const permissionId = getPermissionId(publicationId, event.params.user)
    const permission = new Permission(permissionId)
    permission.address = event.params.user
    permission.publication = publicationId
    permission.articleCreate = true
    permission.articleUpdate = true
    permission.articleDelete = true
    permission.publicationUpdate = true
    permission.publicationDelete = true
    permission.publicationPermissions = true
    permission.save()

    const publication = new Publication(publicationId)
    publication.title = jsonToString(content.get("title"))
    publication.description = jsonToString(content.get("description"))
    publication.image = jsonToString(content.get("image"))
    publication.tags = jsonToArrayString(content.get("tags"))
    publication.createdOn = event.block.timestamp
    publication.lastUpdated = event.block.timestamp
    publication.save()
  }
  if (subAction == SUB_ACTION__UPDATE) {
    const publicationId = jsonToString(content.get("id"))
    const publication = Publication.load(publicationId)

    if (!publication) {
      log.info("Trying to update unknown publication", [publicationId])
      return
    }
    let hasChanges = false

    const title = jsonToString(content.get("title"))
    if (title != "") {
      publication.title = title
      hasChanges = true
    }
    const description = jsonToString(content.get("description"))
    if (description != "") {
      publication.description = description
      hasChanges = true
    }
    const image = jsonToString(content.get("image"))
    if (image != "") {
      publication.image = image
      hasChanges = true
    }
    const tags = jsonToArrayString(content.get("tags"))
    if (tags != []) {
      publication.tags = tags
      hasChanges = true
    }

    if (hasChanges) {
      publication.lastUpdated = event.block.timestamp
      publication.save()
    }
  }
  if (subAction == SUB_ACTION__DELETE) {
    const publicationId = jsonToString(content.get("id"))
    store.remove(PUBLICATION_ENTITY_TYPE, publicationId)
  }
}

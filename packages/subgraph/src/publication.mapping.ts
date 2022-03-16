import { JSONValue, TypedMap } from "@graphprotocol/graph-ts"
import { NewPost } from "../generated/Poster/Poster"
import { Permission, Publication } from "../generated/schema"
import { getPermissionId, jsonToString, SUB_ACTION__CREATE, SUB_ACTION__DELETE } from "./utils"
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
    publication.save()
  }
  if (subAction == SUB_ACTION__DELETE) {
    const publicationId = jsonToString(content.get("id"))
    store.remove(PUBLICATION_ENTITY_TYPE, publicationId)
  }
}

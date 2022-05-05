import { Address, dataSource, JSONValue, JSONValueKind, log, TypedMap, ValueKind } from "@graphprotocol/graph-ts"
import { NewPost } from "../generated/Poster/Poster"
import { Permission, Publication } from "../generated/schema"
import {
  ACTION__ARTICLE,
  ACTION__PUBLICATION,
  getPermissionId,
  jsonToArrayString,
  jsonToString,
  SUB_ACTION__CREATE,
  SUB_ACTION__DELETE,
  SUB_ACTION__PERMISSIONS,
  SUB_ACTION__UPDATE,
} from "./utils"
import { store } from "@graphprotocol/graph-ts"

export const getPublicationId = (event: NewPost): string =>
  dataSource.network() + ":P-" + event.transaction.hash.toHex() + "-" + event.logIndex.toString()
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
  if (subAction == SUB_ACTION__PERMISSIONS) {
    const publicationId = jsonToString(content.get("id"))
    const account = Address.fromString(jsonToString(content.get("account")))
    const newPermissions = content.get("permissions")

    const permissionId = getPermissionId(publicationId, account)
    let permission = Permission.load(permissionId)
    if (!permission) {
      permission = new Permission(permissionId)
      permission.address = account
      permission.publication = publicationId
    }

    if (newPermissions == null) {
      log.warning("No new permissions to set.", [publicationId, account.toHex()])
      return
    }
    // update permissions
    const articleCreate = newPermissions.toObject().get(ACTION__ARTICLE + "/" + SUB_ACTION__CREATE)
    if (articleCreate != null && articleCreate.kind == JSONValueKind.BOOL) {
      permission.articleCreate = articleCreate.toBool()
    }
    const articleUpdate = newPermissions.toObject().get(ACTION__ARTICLE + "/" + SUB_ACTION__UPDATE)
    if (articleUpdate != null && articleUpdate.kind == JSONValueKind.BOOL) {
      permission.articleUpdate = articleUpdate.toBool()
    }
    const articleDelete = newPermissions.toObject().get(ACTION__ARTICLE + "/" + SUB_ACTION__DELETE)
    if (articleDelete != null && articleDelete.kind == JSONValueKind.BOOL) {
      permission.articleDelete = articleDelete.toBool()
    }
    const publicationUpdate = newPermissions.toObject().get(ACTION__PUBLICATION + "/" + SUB_ACTION__UPDATE)
    if (publicationUpdate != null && publicationUpdate.kind == JSONValueKind.BOOL) {
      permission.publicationUpdate = publicationUpdate.toBool()
    }
    const publicationDelete = newPermissions.toObject().get(ACTION__PUBLICATION + "/" + SUB_ACTION__DELETE)
    if (publicationDelete != null && publicationDelete.kind == JSONValueKind.BOOL) {
      permission.publicationDelete = publicationDelete.toBool()
    }
    const publicationPermissions = newPermissions.toObject().get(ACTION__PUBLICATION + "/" + SUB_ACTION__PERMISSIONS)
    if (publicationPermissions != null && publicationPermissions.kind == JSONValueKind.BOOL) {
      permission.publicationPermissions = publicationPermissions.toBool()
    }

    permission.save()
  }
}

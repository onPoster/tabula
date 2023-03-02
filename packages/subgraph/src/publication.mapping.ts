import { Address, JSONValue, JSONValueKind, log, TypedMap } from "@graphprotocol/graph-ts"
import { NewPost } from "../generated/Poster/Poster"
import { Permission, Publication } from "../generated/schema"
import {
  ACTION__ARTICLE,
  ACTION__PUBLICATION,
  getIdFromContent,
  getPermissionId,
  getPublicationId,
  getPublicationHash,
  jsonToArrayString,
  jsonToString,
  SUB_ACTION__CREATE,
  SUB_ACTION__DELETE,
  SUB_ACTION__PERMISSIONS,
  SUB_ACTION__UPDATE,
} from "./utils"
import { store } from "@graphprotocol/graph-ts"
import { ARTICLE_ENTITY_TYPE, PERMISSION_ENTITY_TYPE, PUBLICATION_ENTITY_TYPE } from "../tests/util"

export function handlePublicationAction(subAction: String, content: TypedMap<string, JSONValue>, event: NewPost): void {
  if (subAction == SUB_ACTION__CREATE) {
    const publicationId = getPublicationId(event)

    const publicationHash = getPublicationHash(publicationId)
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
    publication.hash = publicationHash
    publication.title = jsonToString(content.get("title"))
    publication.description = jsonToString(content.get("description"))
    publication.image = jsonToString(content.get("image"))
    publication.tags = jsonToArrayString(content.get("tags"))
    publication.articles = []
    publication.permissions = [permissionId]
    publication.createdOn = event.block.timestamp
    publication.lastUpdated = event.block.timestamp
    publication.save()
  }
  if (subAction == SUB_ACTION__UPDATE) {
    const publicationId = getIdFromContent(content, "id")
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
    const publicationId = getIdFromContent(content, "id")
    const publication = Publication.load(publicationId)
    if (publication == null) {
      log.error("Publication: Publication does not exist.", [publicationId])
    } else {
      const articles = publication.articles
      articles.forEach((article) => {
        log.info("Publication: Deleting Article: ", [article])
        store.remove(ARTICLE_ENTITY_TYPE, article)
      })

      const permissions = publication.permissions
      permissions.forEach((permission) => {
        log.info("Publication: Deleting Permission: ", [permission])
        store.remove(PERMISSION_ENTITY_TYPE, permission)
      })

      log.info("Deleting Publication: ", [publicationId])
      store.remove(PUBLICATION_ENTITY_TYPE, publicationId)
    }
    return
  }
  if (subAction == SUB_ACTION__PERMISSIONS) {
    const publicationId = getIdFromContent(content, "id")
    const publication = Publication.load(publicationId)
    const account = Address.fromString(jsonToString(content.get("account")))
    const newPermissions = content.get("permissions")

    if (publication) {
      const permissionId = getPermissionId(publicationId, account)
      let permission = Permission.load(permissionId)
      if (!permission) {
        permission = new Permission(permissionId)
        permission.address = account
        permission.publication = publicationId
        permission.articleCreate = false
        permission.articleDelete = false
        permission.articleUpdate = false
        permission.publicationDelete = false
        permission.publicationPermissions = false
        permission.publicationUpdate = false
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

      const permissionIndex = publication.permissions.indexOf(permissionId)
      const isNewPermission = permissionIndex == -1
      if (
        permission.articleCreate ||
        permission.articleUpdate ||
        permission.articleDelete ||
        permission.publicationUpdate ||
        permission.publicationDelete ||
        permission.publicationPermissions
      ) {
        if (isNewPermission) {
          let permissions = publication.permissions
          permissions.push(permissionId)
          publication.permissions = permissions
          publication.save()
        }
      } else {
        // has no permissions
        store.remove(PERMISSION_ENTITY_TYPE, permissionId)

        if (!isNewPermission) {
          let permissions = publication.permissions
          permissions.splice(permissionIndex, 1)
          publication.permissions = permissions
          publication.save()
        }
      }
    } else {
      log.warning("Permission: Publication does not exist", [publicationId])
      return
    }
  }
}

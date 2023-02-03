import { Address, JSONValue, JSONValueKind, log, TypedMap, dataSource } from "@graphprotocol/graph-ts"
import { NewPost } from "../generated/Poster/Poster"
import { Article, Permission, Publication } from "../generated/schema"
export const ACTION__ARTICLE = "article"
export const ACTION__PUBLICATION = "publication"

export const SUB_ACTION__CREATE = "create"
export const SUB_ACTION__UPDATE = "update"
export const SUB_ACTION__DELETE = "delete"
export const SUB_ACTION__PERMISSIONS = "permissions"

export const PUBLICATION_ENTITY_TYPE = "Publication"
export const ARTICLE_ENTITY_TYPE = "Article"
export const PERMISSION_ENTITY_TYPE = "Permission"

export const getPublicationId = (event: NewPost): string =>
  dataSource.network() + "-P-" + event.transaction.hash.toHex() + "-" + event.logIndex.toString()

export const getArticleId = (event: NewPost): string =>
  dataSource.network() + "-A-" + event.transaction.hash.toHex() + "-" + event.logIndex.toString()

export const getPermissionId = (publicationId: string, user: Address): string =>
  dataSource.network() + "-X-" + publicationId + "-" + user.toHex()

// this will also update the id if it's in an old format

// converts old IDs to new IDs (this function can be expanded later if we want to upgrade to another form of IDs later)
const cleanId = (id: string): string => {
  if (id.startsWith("P-") || id.startsWith("A-") || id.startsWith("X-")) {
    return dataSource.network() + "-" + id
  } else {
    return id
  }
}
export const getIdFromContent = (content: TypedMap<string, JSONValue>, idKey: string): string => {
  const id = jsonToString(content.get(idKey))
  return cleanId(id)
}

export const hasPermission = (actionType: String[], content: TypedMap<string, JSONValue>, event: NewPost): bool => {
  const publicationId = getIdFromContent(content, "publicationId")

  if (actionType[0] == ACTION__PUBLICATION && actionType[1] == SUB_ACTION__CREATE) {
    // every account is allowed to create publications
    return true
  }
  if (actionType[0] == ACTION__ARTICLE && actionType[1] == SUB_ACTION__CREATE) {
    if (publicationId == "") {
      log.error("A publication ID is required.", [])
    }
    // check that the account has `article/create` permission for the publication
    return hasPublicationPermission(publicationId, event.params.user, actionType)
  }

  if (
    actionType[0] == ACTION__ARTICLE &&
    (actionType[1] == SUB_ACTION__UPDATE || actionType[1] == SUB_ACTION__DELETE)
  ) {
    const articleId = jsonToString(content.get("id"))
    const article = Article.load(articleId)

    if (!article) {
      log.info("Trying to update unknown article", [articleId])
      return false
    }

    if (article.publication == null) {
      log.error("The article does not belong to a publication. This should never happen.", [articleId])
    }

    // check it is an article in a publication where the user has `article/update` permission
    return hasPublicationPermission(changetype<string>(article.publication), event.params.user, actionType)
  }

  if (
    actionType[0] == ACTION__PUBLICATION &&
    (actionType[1] == SUB_ACTION__UPDATE ||
      actionType[1] == SUB_ACTION__DELETE ||
      actionType[1] == SUB_ACTION__PERMISSIONS)
  ) {
    const publicationId = getIdFromContent(content, "id")
    return hasPublicationPermission(publicationId, event.params.user, actionType)
  }

  return false
}

/**
 * Make sure the given JSONValue is a string and returns string it contains.
 * Returns blank string otherwise.
 */
export function jsonToString(val: JSONValue | null): string {
  if (val != null && val.kind === JSONValueKind.STRING) {
    return val.toString()
  }
  return ""
}

/**
 * Make sure the given JSONValue is an array of strings and returns
 * It optimistically skips over any values that are not string within the array
 * Returns blank array otherwise
 */
export function jsonToArrayString(val: JSONValue | null): Array<string> {
  if (val != null && val.kind === JSONValueKind.ARRAY) {
    let valArray = val.toArray()
    let result: Array<string> = new Array()
    for (let i = 0; i < valArray.length; i++) {
      if (valArray[i].kind === JSONValueKind.STRING) result.push(valArray[i].toString())
    }
    return result
  }
  return []
}

export const getActionType = (content: JSONValue): String[] => {
  const actionString = jsonToString(content.toObject().get("action"))
  return actionString.split("/")
}

function hasPublicationPermission(publicationId: string, user: Address, actionType: String[]): bool {
  const publication = Publication.load(publicationId)
  if (!publication) {
    log.warning("Permissions: Publication does not exist.", [publicationId])
    return false
  }
  const permissionId = getPermissionId(publicationId, user)
  const permission = Permission.load(permissionId)
  if (!permission) {
    log.warning("The user does not have any permissions for this publication.", [permissionId, user.toHex()])
    return false
  }

  if (
    permission.get("articleCreate") != null &&
    actionType[0] == ACTION__ARTICLE &&
    actionType[1] == SUB_ACTION__CREATE &&
    permission.articleCreate
  ) {
    return true
  }
  if (
    permission.get("articleUpdate") != null &&
    actionType[0] == ACTION__ARTICLE &&
    actionType[1] == SUB_ACTION__UPDATE &&
    permission.articleUpdate
  ) {
    return true
  }
  if (
    permission.get("articleDelete") != null &&
    actionType[0] == ACTION__ARTICLE &&
    actionType[1] == SUB_ACTION__DELETE &&
    permission.articleDelete
  ) {
    return true
  }
  if (
    permission.get("publicationUpdate") != null &&
    actionType[0] == ACTION__PUBLICATION &&
    actionType[1] == SUB_ACTION__UPDATE &&
    permission.publicationUpdate
  ) {
    return true
  }
  if (
    permission.get("publicationDelete") != null &&
    actionType[0] == ACTION__PUBLICATION &&
    actionType[1] == SUB_ACTION__DELETE &&
    permission.publicationDelete
  ) {
    return true
  }
  if (
    permission.get("publicationPermissions") != null &&
    actionType[0] == ACTION__PUBLICATION &&
    actionType[1] == SUB_ACTION__PERMISSIONS &&
    permission.publicationPermissions
  ) {
    return true
  }

  return false
}

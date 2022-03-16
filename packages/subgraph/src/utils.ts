import { Address, JSONValue, JSONValueKind, log, TypedMap } from "@graphprotocol/graph-ts"
import { NewPost } from "../generated/Poster/Poster"
import { Article, Permission, Publication } from "../generated/schema"
import * as ArticleAction from "../typings/ArticleAction"

export const ACTION__ARTICLE = "article"
export const ACTION__PUBLICATION = "publication"

export const SUB_ACTION__CREATE = "create"
export const SUB_ACTION__UPDATE = "update"
export const SUB_ACTION__DELETE = "delete"
export const SUB_ACTION__PERMISSIONS = "permissions"

export const getPermissionId = (publicationId: string, user: Address): string =>
  "X-" + publicationId + "-" + user.toHex()

export const hasPermission = (actionType: String[], content: TypedMap<string, JSONValue>, event: NewPost): bool => {
  const publicationId = jsonToString(content.get("publicationId"))

  if (actionType[0] == ACTION__PUBLICATION && actionType[1] == SUB_ACTION__CREATE) {
    // every account is allowed to create publications
    return true
  }
  if (actionType[0] == ACTION__ARTICLE && actionType[1] == SUB_ACTION__CREATE && publicationId == "") {
    // every account is allowed to post standalone articles
    return true
  }
  if (actionType[0] == ACTION__ARTICLE && actionType[1] == SUB_ACTION__CREATE && publicationId != "") {
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

    if (article.publication == null && article.poster == event.params.user) {
      // it is a standalone article posted by the user
      // happy path
      return true
    }

    if (article.publication != null) {
      // check it is an article in a publication where the user has `article/update` permission
      return hasPublicationPermission(changetype<string>(article.publication), event.params.user, actionType)
    }

    return false
  }

  if (
    actionType[0] == ACTION__PUBLICATION &&
    (actionType[1] == SUB_ACTION__UPDATE || actionType[1] == SUB_ACTION__DELETE)
  ) {
    const publicationId = jsonToString(content.get("id"))
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
    log.warning("Publication does not exist.", [publicationId])
    return false
  }
  const permissionId = getPermissionId(publicationId, user)
  const permission = Permission.load(permissionId)
  if (!permission) {
    log.warning("The user does not have any permissions for this publication.", [permissionId, user.toHex()])
    return false
  }

  if (actionType[0] == ACTION__ARTICLE && actionType[1] == SUB_ACTION__CREATE && permission.articleCreate) {
    return true
  }
  if (actionType[0] == ACTION__ARTICLE && actionType[1] == SUB_ACTION__UPDATE && permission.articleUpdate) {
    return true
  }
  if (actionType[0] == ACTION__ARTICLE && actionType[1] == SUB_ACTION__DELETE && permission.articleDelete) {
    return true
  }
  if (actionType[0] == ACTION__PUBLICATION && actionType[1] == SUB_ACTION__UPDATE && permission.publicationUpdate) {
    return true
  }
  if (actionType[0] == ACTION__PUBLICATION && actionType[1] == SUB_ACTION__DELETE && permission.publicationDelete) {
    return true
  }
  if (
    actionType[0] == ACTION__PUBLICATION &&
    actionType[1] == SUB_ACTION__PERMISSIONS &&
    permission.publicationPermissions
  ) {
    return true
  }

  return false
}
// export const jsonToArticleAction = (content: JSONValue): ArticleAction.Base => {
//   const object = content.toObject()
//   const stringObject = stringFromObject(object)
//   const stringArrayObject = stringArrayFromObject(object)
//   const action = {
//     action: jsonToString(object.get("action")),
//     id: stringObject("id"),
//     article: stringObject("article"),
//     title: stringObject("title"),
//     publicationId: stringObject("publicationId"),
//     authors: stringArrayObject("authors"),
//     tags: stringArrayObject("tags"),
//     description: stringObject("description"),
//     image: stringObject("image"),
//   }

//   return action
// }

// const stringFromObject = (object: TypedMap<string, JSONValue>) => (key: string) => {
//   const str = jsonToString(object.get(key))
//   return str === "" ? undefined : str
// }

// const stringArrayFromObject = (object: TypedMap<string, JSONValue>) => (key: string) => {
//   const strArray = jsonToArrayString(object.get(key))
//   return strArray.length === 0 ? undefined : strArray
// }

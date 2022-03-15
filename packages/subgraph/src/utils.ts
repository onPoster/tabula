import { Address, JSONValue, JSONValueKind, TypedMap } from "@graphprotocol/graph-ts"
import { Publication } from "../generated/schema"
import * as ArticleAction from "../typings/ArticleAction"

export const getPermissionId = (publicationId: string, user: Address): string =>
  "X-" + publicationId + "-" + user.toHex()

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

import { filter } from "lodash"
import { Permission, Publications } from "../models/publication"

type Action =
  | "articleCreate"
  | "articleDelete"
  | "articleUpdate"
  | "publicationDelete"
  | "publicationPermissions"
  | "publicationUpdate"

export const accessPublications = (publications: Publications[], address: string): Publications[] => {
  const show = filter(publications, { permissions: [{ address: address.toLowerCase() }] })
  if (show.length) {
    return show as Publications[]
  } else {
    return []
  }
}

export const havePermission = (permissions: Permission[], address: string): boolean => {
  const show = filter(permissions, { address: address.toLowerCase() })
  if (show.length) {
    return true
  } else {
    return false
  }
}

export const usersWithPermissions = (permissions: Permission[]): Permission[] => {
  const withPermissions = permissions.filter((permission) => {
    let list
    if (
      permission.articleCreate ||
      permission.articleDelete ||
      permission.articleUpdate ||
      permission.publicationDelete ||
      permission.publicationUpdate ||
      permission.publicationPermissions
    ) {
      list = permission
    }
    return list
  })
  return withPermissions || []
}

export const haveActionPermission = (permissions: Permission[], action: Action, address: string): boolean => {
  const permission = filter(permissions, { address: address.toLowerCase() })
  if (permission && permission.length > 0) {
    if (permission[0][action]) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}
export const isOwner = (permissions: Permission[], address: string): boolean => {
  const permission = filter(permissions, { address: address.toLowerCase() })
  if (permission && permission.length > 0) {
    if (permission[0].articleCreate) {
      return true
    }
    if (permission[0].articleDelete) {
      return true
    }
    if (permission[0].articleUpdate) {
      return true
    }
    if (permission[0].publicationDelete) {
      return true
    }
    if (permission[0].publicationPermissions) {
      return true
    }
    if (permission[0].publicationUpdate) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

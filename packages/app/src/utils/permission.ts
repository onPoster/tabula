import { filter } from "lodash"
import { Permission, Publications } from "../models/publication"

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

export const havePublicationPermission = (permissions: Permission[], address: string): boolean => {
  const permission = filter(permissions, { address: address.toLowerCase() })
  if (permission && permission.length > 0) {
    if (permission[0].publicationPermissions) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

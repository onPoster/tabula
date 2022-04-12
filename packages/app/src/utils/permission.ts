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
      permission.publicationPermissions ||
      permission.publicationUpdate
    ) {
      list = permission
    }
    return list
  })
  return withPermissions || []
}

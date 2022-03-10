import { Action } from "./Action"

interface Base extends Action {
  action: string
  title: string
  tags: string[]
  description: string
  image: string
}

export interface Create extends Base {
  action: "publication/create"
  title: string
}

export interface Update extends Base {
  action: "publication/update"
  id: string
}

export interface Delete {
  action: "publication/delete"
  id: string
}

export interface Permissions {
  action: "publication/permissions"
  id: string
  account: string
  permissions: {
    "article/create": boolean
    "article/update": boolean
    "article/delete": boolean
    "publication/delete": boolean
    "publication/update": boolean
    "publication/permissions": boolean
  }
}

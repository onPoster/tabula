import { Action } from "./Action"

interface Base extends Action {
  action: string
  article?: string
  title?: string
  publicationId?: string
  authors?: [string]
  tags?: [string]
  description?: string
  image?: string
}

export interface Create extends Base {
  action: "article/create"
  article: string
  title: string
}

export interface Update extends Base {
  action: "article/update"
  id: string
}

export interface Delete {
  action: "article/delete"
  id: string
}

import { Article, PermissionAction, Publications } from "../../models/publication"

type ArticleAction = "article/create" | "article/update" | "article/delete" | "article/permissions"
export interface Publication extends Omit<Publications, "id"> {
  action: "publication/create" | "publication/update" | "publication/delete" | "publication/permissions"
  id?: string
}

export interface PosterArticle extends Article {
  action: ArticleAction
  publicationId: string
  authors?: string[]
}
export interface PosterUpdateArticle extends Article {
  action: ArticleAction
  id: string
  authors?: string[]
}

export interface PosterDeleteArticle {
  action: ArticleAction
  id: string
}

export interface PosterPermission {
  action: "publication/permissions"
  id: string
  account: string
  permissions: PermissionAction
}

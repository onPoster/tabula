export interface Permission {
  id: string
  address: string
}

export interface Publications {
  id: string
  description?: string | null
  image?: string | null
  tags?: string[] | null
  title: string
  permissions?: Permission[]
}

export interface Post {
  id: string
  image?: string | null
  tags?: string[] | null
  title: string
}

export interface Article {
  title: string
  article: string
  tags?: string[]
  image?: string
  description?: string
}

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
  articles?: Article[]
  lastUpdated?: string
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
  authors?: string[]
  description?: string | null
  image?: string | null
  id?: string
  lastUpdated?: string
  postedOn?: string
  poster?: string
  publication?: {
    title: string
    image?: string
  }
}

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

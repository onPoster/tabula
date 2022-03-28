export interface Publication {
  action: "publication/create" | "publication/update" | "publication/delete" | "publication/permissions"
  title: string
  tags?: string[]
  description?: string
  image?: string
}

import { Post } from "./content"

export interface Publisher {
  address: string
  image?: string
  posts: Post[]
  title?: string
}

import { Publications } from "../../models/publication"

export interface Publication extends Omit<Publications, "id"> {
  action: "publication/create" | "publication/update" | "publication/delete" | "publication/permissions"
}

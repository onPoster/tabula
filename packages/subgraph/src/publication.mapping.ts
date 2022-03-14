import { JSONValue, TypedMap } from "@graphprotocol/graph-ts"
import { NewPost } from "../generated/Poster/Poster"
import { Publication } from "../generated/schema"
import { jsonToString } from "./utils"
import { store } from "@graphprotocol/graph-ts"

export const getPublicationId = (event: NewPost): string =>
  "P-" + event.transaction.hash.toHex() + "-" + event.logIndex.toString()
const PUBLICATION_ENTITY_TYPE = "Publication"

export function handlePublicationAction(subAction: String, content: TypedMap<string, JSONValue>, event: NewPost): void {
  if (subAction == "create") {
    const publicationId = getPublicationId(event)
    const publication = new Publication(publicationId)
    publication.title = jsonToString(content.get("title"))
    publication.description = jsonToString(content.get("description"))
    publication.image = jsonToString(content.get("image"))
    publication.save()
  }
  if (subAction == "delete") {
    const publicationId = jsonToString(content.get("id"))
    store.remove(PUBLICATION_ENTITY_TYPE, publicationId)
  }
}

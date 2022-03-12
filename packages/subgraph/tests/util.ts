import { newMockEvent } from "matchstick-as/assembly/index"
import { Address, Bytes, ethereum } from "@graphprotocol/graph-ts"
import { Article } from "../generated/schema"
import { NewPost } from "../generated/Poster/Poster"

export const createNewPostEvent = (user: Address, content: string, tag: string): NewPost => {
  let newPostEvent = changetype<NewPost>(newMockEvent())
  newPostEvent.parameters = new Array()

  newPostEvent.parameters.push(new ethereum.EventParam("user", ethereum.Value.fromAddress(user)))
  newPostEvent.parameters.push(new ethereum.EventParam("content", ethereum.Value.fromString(content)))
  newPostEvent.parameters.push(new ethereum.EventParam("tag", ethereum.Value.fromBytes(Bytes.fromHexString(tag))))

  return newPostEvent

  /*

  id: ID!
  publication: Publication
  poster: Bytes! # message sender for article creation event
  article: String! # markdown formatted string or IPFS hash
  authors: [String!]! # array of authors (address or string name)
  postedOn: BigInt! # unix timestamp of original post
  lastUpdated: BigInt! # unix timestamp of last update
  tags: [String!]! # array of tags
  title: String! # title of the post
  description: String # description of the post
  image: String # IPFS hash (pointing to a image) or a BASE64 encoded image string
	*/
}

import { Post } from "../../models/content"
import { client } from "../graphql"
import { GET_POST_QUERY, GET_PUBLISHERS_QUERY, GET_PUBLISHER_QUERY } from "./queries"

interface GetPublishers {
  posts: Post[]
}
interface GetPublisherByAddress {
  posts: Post[]
}
interface GetPost {
  posts: Post[]
}

export const getPublishers = async () => {
  const response = await client.query<GetPublishers>(GET_PUBLISHERS_QUERY).toPromise()
  return response.data?.posts
}

export const getPublisherByAddress = async (address: string) => {
  const response = await client
    .query<GetPublisherByAddress>(GET_PUBLISHER_QUERY, {
      address,
    })
    .toPromise()
  return response.data?.posts
}
export const getPost = async (postId: string) => {
  const response = await client
    .query<GetPost>(GET_POST_QUERY, {
      postId,
    })
    .toPromise()
  return response.data?.posts
}

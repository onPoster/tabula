import { useQuery } from "react-query"
import { getPost } from "../services"

export const usePost = (postId: string) => {
  return useQuery(["publisherPost", postId], async () => {
    return await getPost(postId)
  })
}

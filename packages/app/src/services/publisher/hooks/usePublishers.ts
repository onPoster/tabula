import { useQuery } from "react-query"
import { getPublishers } from "../services"

export const usePublishers = () => {
  return useQuery(["publishers"], async () => {
    return await getPublishers()
  })
}

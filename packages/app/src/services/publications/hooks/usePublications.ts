import { useQuery } from "react-query"
import { getPublications } from "../service"

export const usePublications = () => {
  return useQuery(["publications"], async () => {
    return await getPublications()
  })
}

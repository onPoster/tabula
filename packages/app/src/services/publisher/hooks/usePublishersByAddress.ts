import { useQuery } from "react-query"
import { getPublisherByAddress } from "../services"

export const usePublishersByAddress = (address: string) => {
  return useQuery(["publishersByAddress", address], async () => {
    return await getPublisherByAddress(address)
  })
}

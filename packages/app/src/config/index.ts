import { Web3Provider } from "@ethersproject/providers"

const getLibrary = (provider: any) => {
  return new Web3Provider(provider)
}

export { getLibrary }

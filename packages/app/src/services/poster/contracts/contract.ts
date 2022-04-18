import { Contract } from "@ethersproject/contracts"
import { getDefaultProvider } from "@ethersproject/providers"
import abi from "./abi"

export const getContract = (address: string) => new Contract(address, abi, getDefaultProvider())

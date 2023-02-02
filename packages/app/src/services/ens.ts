import { ethers } from "ethers"

const ensRegistry = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e" // ENS: Registry with Fallback (singleton same address on different chains)
const ensImplementation = "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85" // ENS: Base Registrar Implementation (singleton same address on different chains)

const abiPublicResolver = ["function setText(bytes32 node, string calldata key, string calldata value) external"]

const abiRegistry = [
  "function owner(bytes32 node) external view returns (address)",
  "function resolver(bytes32 node) external view returns (address)",
]

const abiImplementation = ["function ownerOf(uint256 tokenId) public view returns (address owner)"]

export const getTextRecordContent = (provider: ethers.providers.BaseProvider, ensName: string, textRecordKey: string) =>
  provider.getResolver(ensName).then((resolver) => resolver?.getText(textRecordKey))

/**
 * This only works for ENS names using a resolver that conforms to the `abiPublicResolver` (like the PublicResolver).
 */
export const setTextRecord = async (
  provider: ethers.providers.BaseProvider,
  ensName: string,
  key: string,
  content: string,
): Promise<any> => {
  const ensRegistryContract = new ethers.Contract(ensRegistry, abiRegistry, provider)
  const nameHash = ethers.utils.namehash(ensName)
  const ensResolver = await ensRegistryContract.resolver(nameHash)
  const ensResolverContract = new ethers.Contract(ensResolver, abiPublicResolver, provider)
  return await ensResolverContract.setText(nameHash, key, content)
}

// the owner of the NFT
export const checkIfIsOwner = async (provider: ethers.providers.Provider, ensName: string, address: string) => {
  const BigNumber = ethers.BigNumber
  const name = ensName.split(".")[0] // only supports toplevel
  const labelHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(name))
  const tokenId = BigNumber.from(labelHash).toString()
  const ensImplementationContract = new ethers.Contract(ensImplementation, abiImplementation, provider)
  const nftOwner = await ensImplementationContract.ownerOf(tokenId)
  return ethers.utils.getAddress(nftOwner) === ethers.utils.getAddress(address)
}

export const checkIfIsController = async (provider: ethers.providers.Provider, ensName: string, address: string) => {
  const ensRegistryContract = new ethers.Contract(ensRegistry, abiRegistry, provider)
  const nameHash = ethers.utils.namehash(ensName)
  const owner = await ensRegistryContract.owner(nameHash)

  return ethers.utils.getAddress(address) === ethers.utils.getAddress(owner)
}

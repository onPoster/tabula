export const abiPublicResolver = [
  "function setText(bytes32 node, string calldata key, string calldata value) external",
  "function multicall(bytes[] calldata data) external",
]

export const abiRegistry = [
  "function owner(bytes32 node) external view returns (address)",
  "function resolver(bytes32 node) external view returns (address)",
]

export const abiImplementation = ["function ownerOf(uint256 tokenId) public view returns (address owner)"]

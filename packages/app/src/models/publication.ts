export interface Permission {
  id: string
  address: string
  articleCreate: boolean
  articleDelete: boolean
  articleUpdate: boolean
  publicationDelete: boolean
  publicationPermissions: boolean
  publicationUpdate: boolean
}

export interface PermissionAction {
  "article/create": boolean
  "article/update": boolean
  "article/delete": boolean
  "publication/delete": boolean
  "publication/update": boolean
  "publication/permissions": boolean
}

export interface Publications {
  id: string
  description?: string | null
  image?: string | null
  tags?: string[] | null
  title: string
  permissions?: Permission[]
  articles?: Article[]
  lastUpdated?: string
}

export interface Post {
  id: string
  image?: string | null
  tags?: string[] | null
  title: string
}
export interface Article {
  title: string
  article: string
  tags?: string[]
  authors?: string[]
  description?: string | null
  image?: string | null
  id?: string
  lastUpdated?: string
  postedOn?: string
  poster?: string
  publication?: {
    id: string
    title: string
    image?: string
    permissions: Permission[]
  }
}

const THE_GRAPH_NAME_TO_CHAINID: { [name: string]: number } = {
  xdai: 100,
  mainnet: 1,
  rinkeby: 4,
}

export const publicationIdToChainId = (id: string | undefined): number | undefined => {
  // The Graph network names (see: `packages/subgraph/network_configs/`)
  if (id == null) {
    return undefined
  }
  const chainName = id.split(":")[0]
  return THE_GRAPH_NAME_TO_CHAINID[chainName]
}

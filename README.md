# Tabula

[![Build Status](https://github.com/gnosis/tabula/actions/workflows/ci.yaml/badge.svg)](https://github.com/gnosis/tabula/actions/workflows/ci.yaml)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](https://github.com/gnosis/CODE_OF_CONDUCT)

Instant web3 publications for writers, DAOs, and any Ethereum-based account. Built on Poster (EIP-3722).

## Poster Format

### Tag

"PUBLICATION"

### Content

Any properties can be added to articles; this is just a representation of the properties that are utilized in the current version of the Tabula user interface.

#### Create Publication

Lets any account create a new publication. On creation, the message sender gets all permissions. This can be edited via the `publication/permissions` action.

| Property    |     Type     | Value                     |
| ----------- | :----------: | ------------------------- |
| action\*    |    String    | "publication/create"      |
| title\*     |    String    | Publication title         |
| tags        | String Array | Relevant publication tags |
| description |    String    | Publication description   |
| image       |    String    | IPFS hash for an image    |

#### Update Publication

Lets an account update a publication's information. The present properties will overwrite old properties (if a property does not exist, it will be created). The message sender must have `publication/update` permissions to the referenced publication.
| Property | Type | Value |
| ------------------ |:------:| -------- |
| action* | String | "publication/update" |
| id* | String | ID of publication to update (available from the subgraph or created manually using the `event.transaction.hash + "-" + event.logIndex` from the publication creation event) |
| title | String | Content title |
| tags | String Array | Relevant content tags |
| description | String | Content description |
| image | String | IPFS hash for an image. Providing an empty string (`""`) will set image to `null` |

#### Delete Publication

Lets an account delete a publication, along with all associated articles and permissions. The sender must have `publication/delete` permissions to the referenced publication.
| Property | Type | Value |
| ------------------ |:------:| -------- |
| action* | String | "publication/delete" |
| id* | String | ID of publication to delete (available from the subgraph or created manually using the `event.transaction.hash + "-" + event.logIndex` from the publication creation event) |

#### Set Publication Permissions

Lets an account give and/or revoke permissions for an account to a publication. The message sender must have `publication/permissions` permissions to the referenced publication.
| Property | Type | Value |
| ------------------ |:------:| -------- |
| action* | String | "publication/permissions" |
| id* | String | ID of publication to set permissions on (available from the subgraph or created manually using the `event.transaction.hash + "-" + event.logIndex` from the publication creation event) |
| account* | String | The address to set permissions for |
| permissions* | String (JSON object) | A JSON object with permissions to set (details below) |

```json
{
  "article/create": true,
  "article/update": true,
  "article/delete": true,
  "publication/delete": true,
  "publication/update": true,
  "publication/permissions": true
}
```

#### Create Article

Lets an Account post a new article to a publication. The message sender needs `article/create` permissions to the publication.
| Property | Type | Value |
| --------------- | :----------: | -------------------------------------------------------------------------------------------------------------------------------------- |
| action\* | String | "article/create" |
| publicationId\* | String | The ID of the publication this article should be created in.|
| article\* | String | IPFS hash (pointing to a Markdown document) or a markdown formatted string |
| title\* | String | Content title |
| authors | String Array | Author addresses or names |
| tags | String Array | Relevant content tags |
| description | String | Content description |
| image | String | IPFS hash for an image |

#### Update Article

Lets an account update an article. The present properties will overwrite old properties (if a property does not exist, it will be created). The message sender needs `article/update` permission for the publication.
| Property | Type | Value |
| ------------------ |:------:| -------- |
| action* | String | "article/update" |
| id* | String | ID of article to update (available from the subgraph or created manually using the `event.transaction.hash + "-" + event.logIndex` from the article creation event) |
| article | String | IPFS hash (pointing to a Markdown document) or a markdown formatted string |
| title | String | Content title |
| authors | String Array | Author addresses or names |
| tags | String Array | Relevant content tags |
| description | String | Content description. Providing an empty string (`""`) will set description to `null`. |
| image | String | IPFS hash for an image string. Providing an empty string (`""`) will set image to `null`. |

#### Delete Article

Lets an account can delete an article. The message sender needs `article/delete` permission to the publication.
| Property | Type | Value |
| ------------------ |:------:| -------- |
| action* | String | "article/delete" |
| id* | String | ID of article to delete (available from the subgraph or created manually using the `event.transaction.hash + "-" + event.logIndex` from the article creation event) |

`*` means requires

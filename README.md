# Tabula

A blogging app built on Poster (EIP-3722)

## Poster Format

### Tag

"PUBLICATION"

### Content

Any properties can be added to articles, this is just a representation of the properties that are utilized in the current version of the Tabula user interface.

#### Create Publication

On creation, the message sender gets all permissions. This can be edited via setting permissions.

| Property    |     Type     | Value                                                            |
| ----------- | :----------: | ---------------------------------------------------------------- |
| action\*    |    String    | "publication/create"                                             |
| title\*     |    String    | Publication title                                                |
| tags        | String Array | Relevant publication tags                                        |
| description |    String    | Publication description                                          |
| image       |    String    | IPFS hash (pointing to a image) or a BASE64 encoded image string |

#### Update Publication

When updating, both `action` (with "publication/update" value) and `id` are required. The other properties are optional. The present properties will overwrite old properties (if a property does not exist, it will be created). The message sender must be have `publication/update` permissions to the referenced publication.
| Property | Type | Value |
| ------------------ |:------:| -------- |
| action* | String | "publication/update" |
| id* | String | ID of publication to update (available from the subgraph or created manually using the `event.transaction.hash + "-" + event.logIndex` from the publication creation event) |
| title | String | Content title |
| tags | String Array | Relevant content tags |
| description | String | Content description |
| image | String | IPFS hash (pointing to a image) or a BASE64 encoded image string |

#### Delete Publication

When deleting, both `action` (with "delete" value) and `id` are required. The message sender must have `publication/delete` permissions to the referenced publication.
| Property | Type | Value |
| ------------------ |:------:| -------- |
| action* | String | "publication/delete" |
| id* | String | ID of publication to delete (available from the subgraph or created manually using the `event.transaction.hash + "-" + event.logIndex` from the publication creation event) |

#### Set Publication Permissions

When setting permissions `action` (with "publication/permissions" value), `id`, `account` and the `permissions` object are required. The message sender must have `permissions` permissions to the referenced publication.
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

| Property        |     Type     | Value                                                                                                                                  |
| --------------- | :----------: | -------------------------------------------------------------------------------------------------------------------------------------- |
| action\*        |    String    | "article/create"                                                                                                                       |
| publicationId\* |    String    | The ID of the publication this article should be created in. The message sender needs `article/create` permissions to the publication. |
| article\*       |    String    | IPFS hash (pointing to a Markdown document) or a markdown formatted string                                                             |
| title\*         |    String    | Content title                                                                                                                          |
| authors         | String Array | Author addresses or names                                                                                                              |
| tags            | String Array | Relevant content tags                                                                                                                  |
| description     |    String    | Content description                                                                                                                    |
| image           |    String    | IPFS hash (pointing to a image) or a BASE64 encoded image string                                                                       |

#### Update Article

The present properties will overwrite old properties (if a property does not exist, it will be created). The message sender needs `article/update` permission to the publication. |
| Property | Type | Value |
| ------------------ |:------:| -------- |
| action* | String | "article/update" |
| id* | String | ID of article to update (available from the subgraph or created manually using the `event.transaction.hash + "-" + event.logIndex` from the article creation event) |
| article | String | IPFS hash (pointing to a Markdown document) or a markdown formatted string |
| title | String | Content title |
| authors | String Array | Author addresses or names |
| tags | String Array | Relevant content tags |
| description | String | Content description |
| image | String | IPFS hash (pointing to a image) or a BASE64 encoded image string |

#### Delete Article

The message sender needs `article/delete` permission to the publication.
| Property | Type | Value |
| ------------------ |:------:| -------- |
| action* | String | "article/delete" |
| id* | String | ID of article to delete (available from the subgraph or created manually using the `event.transaction.hash + "-" + event.logIndex` from the article creation event) |

`*` means requires

# Tabula

A blogging app built on Poster (EIP-3722)

## Poster Format

### Tag

"PUBLICATION"

### Content

Any properties can be added to publications, this is just a representation of the properties that are utilized in the current version of the Tablua user interface.

#### Create Publication

| Property    |     Type     | Value                                                                      |
| ----------- | :----------: | -------------------------------------------------------------------------- |
| action      |    String    | "create"                                                                   |
| article     |    String    | IPFS hash (pointing to a Markdown document) or a markdown formatted string |
| title       |    String    | Content title                                                              |
| authors     | String Array | Author addresses or names                                                  |
| tags        | String Array | Relevant content tags                                                      |
| description |    String    | Content description                                                        |
| image       |    String    | IPFS hash (pointing to a image) or a BASE64 encoded image string           |

#### Update Publication

When updating, both `action` (with "update" value) and `id` are required. The other properties are optional. The present properties will overwrite old properties (if a property does not exist, it will be created). The message sender must be the same as the message sender used for creating the referenced publication.
| Property | Type | Value |
| ------------------ |:------:| -------- |
| action | String | "update" |
| id | String | ID of publication to delete. (available from the subgraph or created manually using the `event.transaction.hash + "-" + event.logIndex` from the publication creation event) |
| article | String | IPFS hash (pointing to a Markdown document) or a markdown formatted string |
| title | String | Content title |
| authors | String Array | Author addresses or names |
| tags | String Array | Relevant content tags |
| description | String | Content description |
| image | String | IPFS hash (pointing to a image) or a BASE64 encoded image string |

#### Delete Publication

When deleting, both `action` (with "delete" value) and `id` are required. The message sender must be the same as the message sender used for creating the referenced publication.
| Property | Type | Value |
| ------------------ |:------:| -------- |
| action | String | "delete" |
| id | String | ID of publication to delete. (available from the subgraph or created manually using the `event.transaction.hash + "-" + event.logIndex` from the publication creation event) |

# Tabula

A blogging app built on Poster (EIP-3722)

## Poster Format

### Tag

"PUBLICATION"

### Content

Any properties can be added to publications, this is just a representation of the properties that are utilized in the current version of the Tablua user interface.

#### Create Publication

| Property    |     Type     | Value                                       |
| ----------- | :----------: | ------------------------------------------- |
| action      |    String    | "create"                                    |
| article     |    String    | IPFS hash (pointing to a Markdown document) |
| title       |    String    | Content title                               |
| authors     | String Array | Author names                                |
| tags        | String Array | Relevant content tags                       |
| description |    String    | Content description                         |

#### Update Publication

When updating, both `action` (with "update" value) and `id` are required. The other properties are optional. The present properties will overwrite old properties (if a property does not exist, it will be created). The message sender must be the same as the message sender used for creating the referenced publication.
| Property | Type | Value |
| ------------------ |:------:| -------- |
| action | String | "update" |
| id | String | ID of publication to delete (available from the subgraph) |
| article | String | IPFS hash (pointing to a Markdown document) |
| title | String | Content title |
| authors | String Array | Author names |
| tags | String Array | Relevant content tags |
| description | String | Content description |

#### Delete Publication

When deleting, both `action` (with "delete" value) and `id` are required. The message sender must be the same as the message sender used for creating the referenced publication.
| Property | Type | Value |
| ------------------ |:------:| -------- |
| action | String | "delete" |
| id | String | ID of publication to delete (available from the subgraph) |

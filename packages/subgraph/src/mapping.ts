import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Poster, NewPost } from "../generated/Poster/Poster";
import { Post } from "../generated/schema";
import { json, JSONValueKind } from "@graphprotocol/graph-ts";
import { Content } from "../content";

export function handleNewPost(event: NewPost): void {
  // Load post entity
  let post = Post.load(event.transaction.from.toHex());

  // create new entity if it doesn't already exist
  if (!post) {
    post = new Post(event.transaction.from.toHex());
  }

  // decode json content
  let content = new Content(json.fromString(event.params.content));

  // Set user
  post.publisher = event.params.user;

  // Set content
  post.article = content.article;

  // Set authors
  post.authors = content.authors;

  // Set postedOn timestamp
  post.postedOn = event.block.timestamp;

  // Set lastUpdated timestamp
  post.lastUpdated = event.block.timestamp;

  // Set tags
  post.tags = content.tags;

  // Set title
  post.title = content.title;

  // Set description
  post.description = content.description;

  // Set image
  post.image = content.image;

  // Safe updates to store
  post.save();
}

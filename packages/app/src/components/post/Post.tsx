import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Routes, Route, useParams, Link } from "react-router-dom";
import "./post.css";

interface Content {
  article: string;
  authors: [string];
  tags: [string];
  title: string;
  description: string;
  image: string;
  id: string;
}

function Post() {
  const [postId, setPostId] = useState(useParams().postId);
  const [post, setPost] = useState<Content>();
  const [address, setAddress] = useState(useParams().address);

  useEffect(() => {
    console.log("POST PAGE");
    if (postId) {
      getPost(postId);
    }
  }, []);

  async function getPost(postId: String) {
    const result = await fetch(
      `https://api.thegraph.com/subgraphs/name/onposter/tabula`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
        query {
          posts(where:{id: "${postId}"}) {
            id
            publisher
            article
            title
            authors
            tags
            postedOn
            lastUpdated
          }
        }`,
        }),
      }
    );

    const res = await result.json();
    setPost(res.data.posts[0]);
  }

  return (
    <div className="post">
      <Link to={`/${address}`}>Back to posts by {address}</Link>
      {post && (
        <div>
          <ReactMarkdown>{post.article}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export default Post;

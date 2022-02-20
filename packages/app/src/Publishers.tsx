import React, { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route, useParams, Link } from "react-router-dom";

interface Content {
  article: string;
  authors: [string];
  tags: [string];
  title: string;
  description: string;
  image: string;
  id: string;
}

function App() {
  const [posts, setPosts] = useState([]);
  const [address, setAddress] = useState(useParams().address);
  const [publishers, setPublishers] = useState([]);

  useEffect(() => {
    if (address) {
      getPostsForAddress(address);
    }
  }, []);

  async function getPostsForAddress(address: String) {
    const result = await fetch(
      `https://api.thegraph.com/subgraphs/name/onposter/tabula`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
        query {
          posts(where:{publisher: "${address}"}) {
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
    setPosts(res.data.posts);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Posts by</h1>
        <h1 className="publisher">{address}</h1>
      </header>
      <ul>
        {posts.map((post: Content) => (
          <li key={post.id}>
            <Link to={`/${address}/${post.id}`}>
              <h2>{post.title}</h2>
              <p>{post.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

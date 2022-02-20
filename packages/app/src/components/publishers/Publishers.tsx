import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./publishers.css";

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
    <div className="publishers">
      <div className="intro">
        <h2>Posts:</h2>
      </div>
      <ul>
        {posts.map((post: Content) => (
          <li key={post.id}>
            <Link to={`/${address}/${post.id}`}>
              <h3>{post.title}</h3>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

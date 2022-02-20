import React, { useEffect, useState } from "react";
import "./App.css";
import { Link } from "react-router-dom";

interface Content {
  article: string;
  authors: [string];
  tags: [string];
  title: string;
  description: string;
  publisher: string;
  image: string;
  id: string;
}

interface Publisher {
  address: string;
  posts: Array<Content>;
}

function App() {
  const [publishers, setPublishers] = useState<Array<Publisher>>([]);

  useEffect(() => {
    getPublishers();
  }, []);

  async function getPublishers() {
    const result = await fetch(
      `https://api.thegraph.com/subgraphs/name/onposter/tabula`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
        query {
          posts {
            id
            publisher
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
    const publishers: Array<Publisher> = [];

    res.data.posts.forEach((post: Content) => {
      const index = publishers.findIndex(
        (publisher) => publisher.address === post.publisher
      );
      if (index > -1) {
        publishers[index].posts.push(post);
      } else {
        publishers.push({ address: post.publisher, posts: [post] });
      }
    });

    setPublishers(publishers);
  }

  return (
    <ul>
      {publishers.map((publisher: Publisher) => (
        <li key={publisher.address}>
          <Link to={`/${publisher.address}`}>
            <h2>{publisher.address}</h2>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default App;

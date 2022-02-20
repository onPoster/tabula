import React, { useEffect, useState } from "react";
import Page from "./components/layout/Page";
import "./App.css";
import { Link } from "react-router-dom";
import { shortAddress } from "./utils/string";

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
    <Page>
      <div className="index">
        <div className="intro">
          <h2>Publishers:</h2>
        </div>
        <ul>
          {publishers.map((publisher: Publisher) => (
            <li key={publisher.address}>
              <Link to={`/${publisher.address}`}>
                <div className="publisher-box">
                  <h3>{shortAddress(publisher.address)}</h3>

                  <p>{publisher.posts.length} posts</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Page>
  );
}

export default App;

import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import icon from "./tabula-icon-small.png";
import "./Page.css";

type Props = {
  title?: string;
};

const Page: React.FC<Props> = ({ children }) => {
  const { address: publisherAddress } = useParams();

  console.log(publisherAddress);

  return (
    <div>
      <header>
        <Link to="/">
          <div className="logo">
            <img src={icon} alt="Tabula icon" />
            <h2>Tabula</h2>
          </div>
        </Link>

        {publisherAddress && (
          <div className="publisher-link">
            <Link to={`/${publisherAddress}`} />
          </div>
        )}
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Page;

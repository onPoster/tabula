import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import icon from "./tabula-icon-small.png";
import "./Page.css";

type Props = {
  title?: string;
  address?: string;
};

function shortAddress(address: string) {
  return address.substr(0, 6) + "..." + address.substr(-4);
}

const Page: React.FC<Props> = ({ children, address }) => {
  return (
    <div>
      <header>
        <Link to="/">
          <div className="logo">
            <img src={icon} alt="Tabula icon" />
            <h2>Tabula</h2>
          </div>
        </Link>

        {address && (
          <div className="publisher-link">
            <Link to={`/${address}`}>
              <p>{shortAddress(address)}</p>
            </Link>
          </div>
        )}
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Page;

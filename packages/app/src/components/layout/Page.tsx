import { Link } from "react-router-dom"
import { shortAddress } from "../../utils/string"
import icon from "./tabula-tablet-small.png"
import "./Page.css"

type Props = {
  title?: string
  address?: string
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
  )
}

export default Page

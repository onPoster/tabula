import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import { HashRouter } from "react-router-dom"
import "./index.css"
import { CssBaseline, ThemeProvider } from "@mui/material"
import { day } from "./theme/day"
import { Web3ReactProvider } from "@web3-react/core"
import { getLibrary } from "./config"
import { Helmet } from "react-helmet"

ReactDOM.render(
  <React.StrictMode>
    <Helmet>
      <meta property="og:title" content="Tabula" />
      <meta property="og:site_name" content="Tabula" />
      <meta
        property="og:description"
        content="Instant web3 publications for writers, DAOs, and any Ethereum-based account."
      />
      <meta name="description" content="Instant web3 publications for writers, DAOs, and any Ethereum-based account." />
      <meta property="og:url" content="https://tabula.gg" />
      <meta property="og:image" content="https://tabula.gg/image.jpg" />
    </Helmet>
    <Web3ReactProvider getLibrary={getLibrary}>
      <HashRouter>
        <ThemeProvider theme={day}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </HashRouter>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById("root"),
)

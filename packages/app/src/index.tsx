import React from "react"
import App from "@/App"
import { HashRouter } from "react-router-dom"
import "@/index.css"
import "@/draft.css"
import { CssBaseline, ThemeProvider } from "@mui/material"
import { day } from "@/theme/day"
import { Helmet } from "react-helmet"
import ReactDOM from "react-dom/client"
import { WalletProvider } from "@/connectors/WalletProvider"
import { IPFSProvider } from "@/services/ipfs/context"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.Fragment>
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
    <HashRouter>
      <ThemeProvider theme={day}>
        <WalletProvider>
          <IPFSProvider>
            <CssBaseline />
            <App />
          </IPFSProvider>
        </WalletProvider>
      </ThemeProvider>
    </HashRouter>
  </React.Fragment>,
)

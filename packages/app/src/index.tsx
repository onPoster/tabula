import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import { HashRouter } from "react-router-dom"
import "./index.css"
import { CssBaseline, ThemeProvider } from "@mui/material"
import { day } from "./theme/day"
import { Web3ReactProvider } from "@web3-react/core"
import { getLibrary } from "./config"

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <HashRouter basename="/">
        <ThemeProvider theme={day}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </HashRouter>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById("root"),
)

import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import { HashRouter } from "react-router-dom"
import "./index.css"

ReactDOM.render(
  <React.StrictMode>
    <HashRouter basename="/">
      <App />
    </HashRouter>
  </React.StrictMode>,
  document.getElementById("root"),
)

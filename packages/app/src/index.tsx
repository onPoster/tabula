import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import Publishers from "./components/publishers/Publishers"
import Post from "./components/post/Post"
import reportWebVitals from "./reportWebVitals"
import { HashRouter, Routes, Route } from "react-router-dom"

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path=":address" element={<Publishers />} />
        <Route path=":address/:postId" element={<Post />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById("root"),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

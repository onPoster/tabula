import React from "react"
import { Routes, Route } from "react-router-dom"
import { LandingView } from "./components/views/home/LandingView"
import { PostView } from "./components/views/publishers/PostView"
import { PublishersView } from "./components/views/publishers/PublishersView"
import { QueryClient, QueryClientProvider } from "react-query"

const queryClient = new QueryClient()

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<LandingView />} />
        <Route path=":address" element={<PublishersView />} />
        <Route path=":address/:postId" element={<PostView />} />
      </Routes>
    </QueryClientProvider>
  )
}

export default App;

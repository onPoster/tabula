import React from "react"
import { Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "react-query"
import { LandingView } from "./components/views/home/LandingView"
import { PostView } from "./components/views/publishers/PostView"
import { PublishersView } from "./components/views/publishers/PublishersView"
import { WalletView } from "./components/views/wallet/WalletView"
import { PublishView } from "./components/views/publication/PublishView"
import { SnackbarProvider } from "notistack"

const queryClient = new QueryClient()

const App: React.FC = () => {
  return (
    <SnackbarProvider maxSnack={3}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<LandingView />} />
          <Route path="/wallet" element={<WalletView />} />
          <Route path="/publication/publish" element={<PublishView />} />
          <Route path=":address" element={<PublishersView />} />
          <Route path=":address/:postId" element={<PostView />} />
        </Routes>
      </QueryClientProvider>
    </SnackbarProvider>
  )
}

export default App

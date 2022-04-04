import React, { useEffect } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import { SnackbarProvider } from "notistack"
import { QueryClient, QueryClientProvider } from "react-query"
import { useWeb3React } from "@web3-react/core"
/** Views **/
import { LandingView } from "./components/views/home/LandingView"
import { PostView } from "./components/views/publishers/PostView"
import { PublishersView } from "./components/views/publishers/PublishersView"
import { WalletView } from "./components/views/wallet/WalletView"
import { PublishView } from "./components/views/publication/PublishView"
import { PublicationPostView } from "./components/views/publication/PublicationPostView"
import { PublicationProvider } from "./services/publications/contexts"
import { CreatePostView } from "./components/views/publication/CreatePostView"
import { PreviewPostView } from "./components/views/publication/PreviewPostView"
import ScrollToTop from "./components/commons/ScrollToTop"

const queryClient = new QueryClient()

const App: React.FC = () => {
  const navigate = useNavigate()
  const { active } = useWeb3React()

  useEffect(() => {
    if (!active) {
      navigate("/")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  return (
    <SnackbarProvider maxSnack={3}>
      <QueryClientProvider client={queryClient}>
        <PublicationProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<LandingView />} />
            <Route path="/wallet" element={<WalletView />} />
            <Route path="/publication/publish" element={<PublishView />} />
            <Route path="/publication/create-post" element={<CreatePostView />} />
            <Route path="/publication/preview-post" element={<PreviewPostView />} />
            <Route path="/publication/post/:postId" element={<PublicationPostView />} />
            <Route path=":address" element={<PublishersView />} />
            <Route path=":address/:postId" element={<PostView />} />
          </Routes>
        </PublicationProvider>
      </QueryClientProvider>
    </SnackbarProvider>
  )
}

export default App

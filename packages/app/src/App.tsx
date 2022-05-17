import React, { useEffect, useState } from "react"
import { Routes, Route } from "react-router-dom"
import { SnackbarProvider } from "notistack"
import { Provider as UrqlProvider } from "urql"
/** Views **/
import { LandingView } from "./components/views/home/LandingView"
import { WalletView } from "./components/views/wallet/WalletView"
import { PublishView } from "./components/views/publication/PublishView"
import { PublicationPostView } from "./components/views/publication/PublicationPostView"
import { PublicationProvider } from "./services/publications/contexts"
import { CreatePostView } from "./components/views/publication/CreatePostView"
import { PreviewPostView } from "./components/views/publication/PreviewPostView"
import { ArticleView } from "./components/views/publication/ArticleView"
import ScrollToTop from "./components/commons/ScrollToTop"
import { subgraphClient } from "./services/graphql"
import { PermissionView } from "./components/views/publication/PermissionView"
import SetupIpfsView from "./components/views/pinning/SetupIpfsView"
import { useWeb3React } from "@web3-react/core"
import { SelectNetwork } from "./components/views/wallet/SelectNetwork"

const App: React.FC = () => {
  // the chainId should be from the publication if its present
  const { chainId: initialChainIdFromProvider } = useWeb3React() // chain id from connected wallet
  const [chainId, setChainId] = useState(initialChainIdFromProvider)
  const [currentSubgraphClient, setCurrentSubgraphClient] = useState(subgraphClient(chainId))

  const updateChainId = (newChainId: number | undefined) => {
    setChainId(newChainId)
  }

  useEffect(() => {
    setCurrentSubgraphClient(subgraphClient(chainId))
  }, [chainId])

  return (
    <SnackbarProvider maxSnack={3}>
      <UrqlProvider value={currentSubgraphClient}>
        <PublicationProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<LandingView />} />
            <Route path="/wallet" element={<WalletView />} />
            <Route path="/select-network" element={<SelectNetwork />} />
            <Route path="/pinning" element={<SetupIpfsView />} />
            <Route path="/publication/publish" element={<PublishView updateChainId={updateChainId} />} />
            <Route path="/publication/post-action/:type" element={<CreatePostView />} />
            <Route path="/publication/preview-post/:type" element={<PreviewPostView />} />
            <Route path="/publication/:publicationId" element={<PublicationPostView updateChainId={updateChainId} />} />
            <Route
              path="/publication/:publicationId/article/:articleId"
              element={<ArticleView updateChainId={updateChainId} />}
            />
            <Route path="/publication/permission/:type" element={<PermissionView />} />
          </Routes>
        </PublicationProvider>
      </UrqlProvider>
    </SnackbarProvider>
  )
}

export default App

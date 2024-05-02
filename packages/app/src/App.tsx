import React, { useCallback, useEffect, useState } from "react"
import { PublicationView } from "@/components/views/publication/PublicationView"
import { Routes, Route } from "react-router-dom"
import { SnackbarProvider } from "notistack"
import { Provider as UrqlProvider } from "urql"
/** Views **/
import { LandingView } from "@/components/views/home/LandingView"
import { PublicationsView } from "@/components/views/publication/PublicationsView"
import { ArticleProvider, PublicationProvider } from "@/services/publications/contexts"
import { CreateArticleView } from "@/components/views/publication/CreateArticleView"
import { ArticleView } from "@/components/views/publication/ArticleView"
import ScrollToTop from "@/components/commons/ScrollToTop"
import { subgraphClient } from "@/services/graphql"
import { PermissionView } from "@/components/views/publication/PermissionView"
import { PosterProvider } from "@/services/poster/context"
import { RedirectOldRoute } from "@/components/commons/RedicrectOldRoute"
import PreviewArticleView from "@/components/views/publication/PreviewArticleView"
import { EnsProvider } from "@/services/ens/context"
import { useWeb3ModalAccount } from "@web3modal/ethers5/react"
import { useIPFSContext } from "@/services/ipfs/context"

const App: React.FC = () => {
  const { chainId } = useWeb3ModalAccount()

  const [currentSubgraphClient, setCurrentSubgraphClient] = useState(subgraphClient(chainId))
  const { startIpfsClientInstance } = useIPFSContext()

  useEffect(() => {
    setCurrentSubgraphClient(subgraphClient(chainId))
  }, [chainId])

  useEffect(() => {
    const initIPFS = async () => {
      await startIpfsClientInstance()
    }
    initIPFS()
  }, [startIpfsClientInstance])

  return (
    <SnackbarProvider maxSnack={1}>
      <UrqlProvider value={currentSubgraphClient}>
        <EnsProvider>
          <PublicationProvider>
            <ArticleProvider>
              <PosterProvider>
                <ScrollToTop />
                <Routes>
                  <Route path="/" element={<LandingView />} />
                  <Route path="/publications" element={<PublicationsView />} />
                  <Route path=":publicationSlug" element={<PublicationView />} />
                  {/* <Route path="/goerli/*" element={<RedirectOldRoute />} />
                    <Route path="/mainnet/*" element={<RedirectOldRoute />} />
                    <Route path="/gnosis_chain/*" element={<RedirectOldRoute />} />
                    <Route path="/polygon/*" element={<RedirectOldRoute />} />
                    <Route path="/arbitrum/*" element={<RedirectOldRoute />} />
                    <Route path="/optimism/*" element={<RedirectOldRoute />} />
                    <Route path=":publicationSlug">
                      <Route path="permissions/:type" element={<PermissionView />} />
                      <Route path="new" element={<CreateArticleView type="new" />} />
                      <Route path=":type/preview" element={<PreviewArticleView />} />
                      <Route path=":articleId" element={<ArticleView updateChainId={updateChainId} />} />
                      <Route path=":articleId/edit" element={<CreateArticleView type="edit" />} />
                    </Route> */}
                </Routes>
              </PosterProvider>
            </ArticleProvider>
          </PublicationProvider>
        </EnsProvider>
      </UrqlProvider>
    </SnackbarProvider>
  )
}

export default App

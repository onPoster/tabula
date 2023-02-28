import React, { useEffect, useState } from "react"
import { Box, Stack, useTheme } from "@mui/material"
import SettingsIcon from "../../assets/images/icons/settings"
import ArticleHeader from "./ArticleHeader"
import ArticleSidebar from "../views/publication/components/ArticleSidebar"
import { Publications } from "../../models/publication"
import { Helmet } from "react-helmet"
import { useDynamicFavIcon } from "../../hooks/useDynamicFavIco"
import usePublication from "../../services/publications/hooks/usePublication"
import { palette } from "../../theme"
import shadows from "@mui/material/styles/shadows"
import { useLocation } from "react-router-dom"

type Props = {
  publication?: Publications
  children: React.ReactNode
}

const PublicationPage: React.FC<Props> = ({ children, publication }) => {
  const location = useLocation()
  const [showSidebar, setShowSidebar] = useState<boolean>(true)
  const { imageSrc } = usePublication(publication?.id || "")
  const theme = useTheme()
  useDynamicFavIcon(imageSrc)

  useEffect(() => {
    if (location.pathname.includes("preview")) {
      setShowSidebar(false)
    }
  }, [location])

  return (
    <>
      <Helmet>
        <title>{publication?.title}</title>
        <meta property="og:title" content={publication?.title} />
        {publication?.description != null && [
          <meta property="og:description" content={publication?.description} key="1" />,
          <meta name="description" content={publication?.description} key="2" />,
        ]}
        <meta property="og:url" content={`https://tabula.gg/#/${publication?.id}`} />
      </Helmet>

      <Box
        sx={{
          maxHeight: "100vh",
          flexGrow: 1,
          display: "flex",
          overflow: "hidden",
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          flexDirection: "column",
        }}
      >
        <Box
          component="main"
          sx={{
            position: "relative",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            overflowX: "hidden",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <Stack direction="row" spacing={0}>
            <Box
              component="section"
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                maxWidth: `calc(100vw - var(--sidebar-width), 320px)`,
                position: "relative",
              }}
            >
              <ArticleHeader publication={publication} />
              {children}
              {!showSidebar && (
                <Box
                  onClick={() => setShowSidebar(!showSidebar)}
                  sx={{
                    cursor: "pointer",
                    position: "absolute",
                    bottom: theme.spacing(4),
                    right: theme.spacing(3),
                    p: 1,
                    borderRadius: 999,
                    transition: `all 0.25s ease-in-out`,
                    border: `1px solid ${palette.grays[200]}`,
                    boxShadow: shadows[4],
                    "&:hover": {
                      background: palette.whites[1000],
                      boxShadow: shadows[8],
                      transform: "scale(1.1)",
                    },
                    "&:hover .settingsIcon": {
                      opacity: 1,
                    },
                  }}
                >
                  <SettingsIcon className="settingsIcon" sx={{ color: palette.primary[1000], opacity: 0.8 }} />
                </Box>
              )}
            </Box>
            {showSidebar && <ArticleSidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />}
          </Stack>
        </Box>
      </Box>
    </>
  )
}

export default PublicationPage

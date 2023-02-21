import React, { useEffect, useState } from "react"
import { Avatar, Button, CircularProgress, Grid, Stack, Typography } from "@mui/material"
import { useWeb3React } from "@web3-react/core"
import { WalletBadge } from "../commons/WalletBadge"
import { Publications } from "../../models/publication"
import theme, { palette, typography } from "../../theme"
import { useLocation, useNavigate } from "react-router-dom"
import usePublication from "../../services/publications/hooks/usePublication"
import { INITIAL_ARTICLE_VALUE, usePublicationContext } from "../../services/publications/contexts"
import { UserOptions } from "../commons/UserOptions"

type Props = {
  publication?: Publications
}

const ArticleHeader: React.FC<Props> = ({ publication }) => {
  const { account, active } = useWeb3React()
  const navigate = useNavigate()
  const location = useLocation()
  const {
    setCurrentPath,
    saveDraftArticle,
    saveArticle,
    setArticleContent,
    setMarkdownArticle,
    setExecuteArticleTransaction,
    loading: loadingTransaction,
    ipfsLoading,
  } = usePublicationContext()
  const { refetch, chainId: publicationChainId } = usePublication(publication?.id || "")
  const [show, setShow] = useState<boolean>(false)
  const { imageSrc } = usePublication(publication?.id || "")
  const isPreview = location.pathname.includes("preview")
  useEffect(() => {
    if (location.pathname) {
      setCurrentPath(location.pathname)
    }
  }, [location, setCurrentPath])

  const handleNavigation = async () => {
    refetch()
    saveDraftArticle(INITIAL_ARTICLE_VALUE)
    saveArticle(undefined)
    setArticleContent(undefined)
    setMarkdownArticle(undefined)
    navigate(-1 ?? `../${publication?.id}`)
  }

  const handlePreview = () => {
    isPreview ? navigate(-1) : navigate("../preview")
  }
  return (
    <Stack
      component="header"
      spacing={2}
      sx={{
        alignItems: "center",
        justifyContent: "space-between",
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        zIndex: 2,
        px: 3,
        pt: 3,
        height: 40,
      }}
    >
      <Grid container mt={1} alignItems={"center"} justifyContent={publication ? "space-between" : "flex-end"}>
        {publication && (
          <Grid item>
            <Grid
              container
              alignItems={"center"}
              gap={0.5}
              sx={{ cursor: "pointer", transition: "opacity 0.25s ease-in-out", "&:hover": { opacity: 0.6 } }}
              onClick={handleNavigation}
            >
              <Avatar sx={{ width: 31, height: 31 }} src={imageSrc}>
                {" "}
              </Avatar>

              <Typography
                color={palette.grays[1000]}
                variant="h6"
                fontFamily={typography.fontFamilies.sans}
                sx={{ margin: 0 }}
              >
                {publication.title}
              </Typography>
            </Grid>
          </Grid>
        )}

        <Grid item>
          <Stack
            spacing={3}
            direction="row"
            sx={{
              alignItems: "center",
              [theme.breakpoints.down("md")]: {
                margin: "15px 0px",
              },
            }}
          >
            {account && (
              <Grid
                container
                flexDirection="column"
                alignItems={"end"}
                justifyContent={"flex-end"}
                sx={{ position: "relative" }}
              >
                <Grid item sx={{ cursor: "pointer" }} onClick={() => setShow(!show)}>
                  <WalletBadge hover address={account} />
                </Grid>
                {show && (
                  <Grid item sx={{ position: "absolute", top: 45 }}>
                    <UserOptions />
                  </Grid>
                )}
              </Grid>
            )}
            <Button variant="text" onClick={handlePreview} disabled={loadingTransaction || ipfsLoading}>
              {isPreview ? "Edit" : "Preview"}
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setExecuteArticleTransaction(true)
                // navigate(`../${publication?.id}/new-article/new`)
              }}
              sx={{ py: "2px", minWidth: "unset" }}
              disabled={loadingTransaction || ipfsLoading}
            >
              {loadingTransaction && <CircularProgress size={20} sx={{ marginRight: 1 }} />}
              Publish
            </Button>
          </Stack>
        </Grid>

        {!active && (
          <Button
            variant="outlined"
            sx={{
              color: "#000000",
              border: `2px solid ${palette.grays[400]}`,
              "&:hover": {
                backgroundColor: palette.grays[200],
                border: `2px solid ${palette.grays[400]}`,
                boxShadow: "0 4px rgba(0,0,0,0.1), inset 0 -4px 4px #97220100",
              },
            }}
            onClick={() => navigate(`/wallet?publicationChainId=${publicationChainId}`)}
          >
            Connect Wallet
          </Button>
        )}
      </Grid>
    </Stack>
  )
}

export default ArticleHeader

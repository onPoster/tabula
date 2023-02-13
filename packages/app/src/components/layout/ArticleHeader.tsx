import React, { useEffect, useState } from "react"
import { Avatar, Button, Grid, Stack, Typography } from "@mui/material"
import { useWeb3React } from "@web3-react/core"
import { WalletBadge } from "../commons/WalletBadge"
import { Publications } from "../../models/publication"
import theme, { palette, typography } from "../../theme"
import { useLocation, useNavigate } from "react-router-dom"
import usePublication from "../../services/publications/hooks/usePublication"
import { usePublicationContext } from "../../services/publications/contexts"
import { UserOptions } from "../commons/UserOptions"

type Props = {
  publication?: Publications
}

const ArticleHeader: React.FC<Props> = ({ publication }) => {
  const { account, active } = useWeb3React()
  const navigate = useNavigate()
  const location = useLocation()
  const { setCurrentPath, saveDraftArticle, saveArticle } = usePublicationContext()
  const { refetch, chainId: publicationChainId } = usePublication(publication?.id || "")
  const [show, setShow] = useState<boolean>(false)
  const { imageSrc } = usePublication(publication?.id || "")

  useEffect(() => {
    if (location.pathname) {
      setCurrentPath(location.pathname)
    }
  }, [location, setCurrentPath])

  const handleNavigation = async () => {
    refetch()
    saveDraftArticle(undefined)
    saveArticle(undefined)
    navigate(`../${publication?.id}`)
  }

  return (
    <Stack
      component="header"
      direction="row"
      spacing={2}
      sx={{
        alignItems: "center",
        justifyContent: publication ? "space-between" : "flex-end",
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        zIndex: 2,
        px: 3,
        height: 40,
        mt: 4,
      }}
    >
      {publication && (
        <Stack
          alignItems={"center"}
          spacing={0.5}
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
        </Stack>
      )}

      <Stack
        spacing={3}
        direction="row"
        sx={{
          alignItems: "center",
        }}
      >
        <Stack direction="row" sx={{ alignItems: "center" }} spacing={1}>
          <Button
            variant="text"
            onClick={() => {
              // Preview
              // navigate(`../${publication?.id}/new-article/new`)
            }}
            sx={{
              fontSize: 14,
            }}
          >
            Preview
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              navigate(`../${publication?.id}/new-article/new`)
            }}
            sx={{ fontSize: 14, py: "2px", minWidth: "unset" }}
          >
            Publish
          </Button>
        </Stack>
        {!active ? (
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
        ) : (
          account && (
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
          )
        )}
      </Stack>
    </Stack>
  )
}

export default ArticleHeader

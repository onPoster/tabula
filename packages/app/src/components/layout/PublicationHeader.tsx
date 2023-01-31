import React, { useEffect, useState } from "react"
import { Avatar, Button, Container, Grid, styled, Typography } from "@mui/material"
import { useWeb3React } from "@web3-react/core"
import { WalletBadge } from "../commons/WalletBadge"
import { Publication } from "../../models/publication"
import AddIcon from "@mui/icons-material/Add"
import theme, { palette, typography } from "../../theme"
import { useLocation, useNavigate } from "react-router-dom"
import usePublication from "../../services/publications/hooks/usePublication"
import { haveActionPermission } from "../../utils/permission"
import { usePublicationContext } from "../../services/publications/contexts"
import { UserOptions } from "../commons/UserOptions"
import DeterministicAvatar from "../commons/DeterministicAvatar"

type Props = {
  publication?: Publication
  showCreatePost?: boolean
}

const ItemContainer = styled(Grid)({
  alignItems: "center",
  justifyContent: "space-between",
  gap: 40,
  [theme.breakpoints.down("md")]: {
    margin: "15px 0px",
  },
})
const PublicationHeader: React.FC<Props> = ({ publication, showCreatePost }) => {
  const { account, active } = useWeb3React()
  const navigate = useNavigate()
  const location = useLocation()
  const { setCurrentPath, saveDraftArticle, saveArticle } = usePublicationContext()
  const { refetch, chainId: publicationChainId } = usePublication(publication?.id || "")
  const [show, setShow] = useState<boolean>(false)
  const permissions = publication && publication.permissions
  const { imageSrc } = usePublication(publication?.id || "")

  useEffect(() => {
    if (location.pathname) {
      setCurrentPath(location.pathname)
    }
  }, [location, setCurrentPath])

  const havePermissionToCreate = permissions ? haveActionPermission(permissions, "articleCreate", account || "") : false

  const handleNavigation = async () => {
    refetch()
    saveDraftArticle(undefined)
    saveArticle(undefined)
    navigate(`../${publication?.id}`)
  }

  return (
    <Container
      maxWidth="lg"
      component="header"
      sx={{
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
        mt: 6,
        position: "relative",
        zIndex: 2,
      }}
    >
      <Grid container mt={1} alignItems={"center"} justifyContent={publication ? "space-between" : "flex-end"}>
        {publication && (
          <Grid item>
            <Grid
              container
              alignItems={"center"}
              gap={1}
              sx={{ cursor: "pointer", transition: "opacity 0.25s ease-in-out", "&:hover": { opacity: 0.6 } }}
              onClick={handleNavigation}
            >
              {publication?.image ? (
                <Avatar sx={{ width: 47, height: 47 }} src={imageSrc} />
              ) : (
                <DeterministicAvatar hash={publication.hash} width={47} height={47} />
              )}

              <Typography
                color={palette.grays[1000]}
                variant="h5"
                fontFamily={typography.fontFamilies.sans}
                sx={{ margin: 0 }}
              >
                {publication.title}
              </Typography>
            </Grid>
          </Grid>
        )}

        <Grid item>
          <ItemContainer container>
            <Grid item>
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
            </Grid>

            {showCreatePost && havePermissionToCreate && (
              <Grid item>
                <Button
                  variant="contained"
                  size={"large"}
                  onClick={() => {
                    navigate(`../${publication?.id}/new-article/new`)
                  }}
                >
                  <AddIcon style={{ marginRight: 13 }} />
                  New Article
                </Button>
              </Grid>
            )}
          </ItemContainer>
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
    </Container>
  )
}

export default PublicationHeader

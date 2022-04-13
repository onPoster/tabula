import React from "react"
import { Avatar, Button, Container, Grid, styled, Typography } from "@mui/material"
import { useWeb3React } from "@web3-react/core"
import { WalletBadge } from "../commons/WalletBadge"
import { Publications } from "../../models/publication"
import AddIcon from "@mui/icons-material/Add"
import theme, { palette, typography } from "../../theme"
import { useNavigate } from "react-router-dom"
import usePublication from "../../services/publications/hooks/usePublication"

type Props = {
  publication?: Publications
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
  const { account } = useWeb3React()
  const navigate = useNavigate()
  const { refetch } = usePublication(publication?.id || "")
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
              gap={2}
              sx={{ cursor: "pointer" }}
              onClick={() => {
                refetch()
                navigate(`/publication/post/${publication?.id}`)
              }}
            >
              <Avatar
                sx={{ width: 47, height: 47 }}
                src={publication?.image ? `https://ipfs.infura.io/ipfs/${publication.image}` : ""}
              >
                {" "}
              </Avatar>

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
            {account && (
              <Grid item>
                <WalletBadge address={account} />
              </Grid>
            )}
            {showCreatePost && (
              <Grid item>
                <Button variant="contained" size={"large"} onClick={() => navigate("/publication/post-action/new")}>
                  <AddIcon style={{ marginRight: 13 }} />
                  New Post
                </Button>
              </Grid>
            )}
          </ItemContainer>
        </Grid>
      </Grid>
    </Container>
  )
}

export default PublicationHeader

import React, { useEffect, useRef, useState } from "react"
import { Box, Button, Container, Grid, styled, Typography } from "@mui/material"
import { useWeb3React } from "@web3-react/core"
import { WalletBadge } from "../commons/WalletBadge"
import { Publication } from "../../models/publication"
import AddIcon from "@mui/icons-material/Add"
import theme, { palette, typography } from "../../theme"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import usePublication from "../../services/publications/hooks/usePublication"
import { haveActionPermission } from "../../utils/permission"
import {
  INITIAL_ARTICLE_BLOCK,
  INITIAL_ARTICLE_VALUE,
  useArticleContext,
  usePublicationContext,
} from "../../services/publications/contexts"
import { UserOptions } from "../commons/UserOptions"
// import { useOnClickOutside } from "../../hooks/useOnClickOutside"
import { Edit } from "@mui/icons-material"

import Avatar from "../commons/Avatar"
import { checkTag } from "../../utils/string-handler"
import { useIpfs } from "../../hooks/useIpfs"


type Props = {
  articleId?: string
  publication?: Publication
  showCreatePost?: boolean
  showEditButton?: boolean
}

const ItemContainer = styled(Grid)({
  alignItems: "center",
  justifyContent: "space-between",
  gap: 40,
  [theme.breakpoints.down("md")]: {
    margin: "15px 0px",
  },
})
const PublicationHeader: React.FC<Props> = ({ articleId, publication, showCreatePost, showEditButton }) => {
  const ipfs = useIpfs()
  const { publicationSlug } = useParams<{ publicationSlug: string }>()
  const { account, active } = useWeb3React()
  const navigate = useNavigate()
  const location = useLocation()
  const { savePublication } = usePublicationContext()
  const {
    article,
    setCurrentPath,
    saveDraftArticle,
    saveArticle,
    setArticleContent,
    setMarkdownArticle,
    setDraftArticleThumbnail,
  } = useArticleContext()
  const { refetch, chainId: publicationChainId } = usePublication(publicationSlug || "")
  const [show, setShow] = useState<boolean>(false)
  const permissions = publication && publication.permissions

  const ref = useRef()
  // useOnClickOutside(ref, () => {
  //   if (show) {
  //     setShow(!show)
  //   }
  // })

  useEffect(() => {
    if (location.pathname) {
      setCurrentPath(location.pathname)
    }
  }, [location, setCurrentPath])

  const havePermissionToCreate = permissions ? haveActionPermission(permissions, "articleCreate", account || "") : false
  const havePermissionToUpdate = permissions ? haveActionPermission(permissions, "articleUpdate", account || "") : false

  const handleNavigation = () => {
    refetch()
    saveDraftArticle(INITIAL_ARTICLE_VALUE)
    saveArticle(undefined)
    navigate(`/${publicationSlug}`)
  }

  const handleEditNavigation = () => {
    if (article) {
      const { image: thumbnailImg, article: articleContent } = article

      const imgPromise: Promise<string | null> = thumbnailImg ? ipfs.getImgSrc(thumbnailImg) : Promise.resolve(null)
      const contentPromise: Promise<void | null> = articleContent
        ? ipfs.getText(articleContent).then((content) => {
            if (content) {
              const block = checkTag(content)
              if (block.length) {
                setArticleContent(block)
              }
            }
          })
        : Promise.resolve(null)

      Promise.all([imgPromise, contentPromise]).then(([img]) => {
        saveDraftArticle({ ...article, title: article.title, image: img })
      })

      savePublication(article.publication)
      navigate(`/${publication?.id}/${articleId}/edit`)
    }
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
              <Avatar publicationSlug={publicationSlug || ""} width={47} height={47} dynamicFavIcon />

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
                      <Box ref={ref}>
                        <UserOptions />
                      </Box>
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
                    navigate(`./new`)
                    setArticleContent(INITIAL_ARTICLE_BLOCK)
                    setMarkdownArticle(undefined)
                    saveDraftArticle(INITIAL_ARTICLE_VALUE)
                    saveArticle(undefined)
                    setDraftArticleThumbnail(undefined)
                  }}
                >
                  <AddIcon style={{ marginRight: 13 }} />
                  New Article
                </Button>
              </Grid>
            )}

            {showEditButton && havePermissionToUpdate && (
              <Grid item>
                <Button
                  variant="contained"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleEditNavigation()
                  }}
                >
                  <Edit sx={{ mr: "13px", width: 16 }} />
                  Edit
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

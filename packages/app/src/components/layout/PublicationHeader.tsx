import React, { useEffect, useMemo, useRef, useState } from "react"
import { Box, Button, Container, Grid, styled, Typography } from "@mui/material"
import { WalletBadge } from "@/components/commons/WalletBadge"
import { Publication } from "@/models/publication"
import AddIcon from "@mui/icons-material/Add"
import theme, { palette, typography } from "@/theme"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import usePublication from "@/services/publications/hooks/usePublication"
import { haveActionPermission } from "@/utils/permission"
import { INITIAL_ARTICLE_VALUE, useArticleContext } from "@/services/publications/contexts"
import { UserOptions } from "@/components/commons/UserOptions"
// import { useOnClickOutside } from "@/hooks/useOnClickOutside"
import { Edit } from "@mui/icons-material"
import isIPFS from "is-ipfs"
// import { useIpfs } from "@/hooks/useIpfs"
import Avatar from "@/components/commons/Avatar"
// import { processArticleContent } from "@/utils/modifyHTML"
import { useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers5/react"
import { addUrlToImageHashes } from "@/services/publications/utils/article-method"
import { useIPFSContext } from "@/services/ipfs/context"

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
const PublicationHeader: React.FC<Props> = ({ publication, showCreatePost, showEditButton }) => {
  const { publicationSlug } = useParams<{ publicationSlug: string }>()
  const { address, isConnected } = useWeb3ModalAccount()
  const navigate = useNavigate()
  const location = useLocation()
  const {
    article,
    setCurrentPath,
    saveDraftArticle,
    saveArticle,
    setMarkdownArticle,
    setDraftArticleThumbnail,
    setArticleEditorState,
    articleFormMethods,
  } = useArticleContext()
  const { open } = useWeb3Modal()
  const { refetch } = usePublication(publicationSlug || "")
  const { decodeIpfsHash } = useIPFSContext()
  const [show, setShow] = useState<boolean>(false)
  const permissions = publication && publication.permissions
  const isValidHash = useMemo(() => article && isIPFS.multihash(article.article), [article])

  const ref = useRef()
  const { setValue } = articleFormMethods
  useEffect(() => {
    if (location.pathname) {
      setCurrentPath(location.pathname)
    }
  }, [location, setCurrentPath])

  const havePermissionToCreate = permissions ? haveActionPermission(permissions, "articleCreate", address || "") : false
  const havePermissionToUpdate = permissions ? haveActionPermission(permissions, "articleUpdate", address || "") : false

  const handleNavigation = () => {
    refetch()
    saveDraftArticle(INITIAL_ARTICLE_VALUE)
    saveArticle(undefined)
    navigate(`/${publicationSlug}`)
  }

  const handleEditNavigation = async () => {
    if (article) {
      let post = isValidHash ? await decodeIpfsHash(article?.article) : article?.article
      setValue("id", article.id)
      setValue("title", article.title)
      setValue("article", addUrlToImageHashes(post))
      setValue("description", article.description ?? undefined)
      setValue("lastUpdated", article.lastUpdated ?? undefined)
      setValue(
        "tags",
        article.tags
          ? article.tags.map((tag) => {
              return { label: tag, value: tag }
            })
          : undefined,
      )
      setValue("image", article.image)
      navigate(`/${article.publication?.id}/edit`)
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
              {address && (
                <Grid
                  container
                  flexDirection="column"
                  alignItems={"end"}
                  justifyContent={"flex-end"}
                  sx={{ position: "relative" }}
                >
                  <Grid item sx={{ cursor: "pointer" }} onClick={() => setShow(!show)}>
                    <WalletBadge hover address={address} />
                  </Grid>
                  {show && (
                    <Grid item sx={{ position: "absolute", top: 45 }}>
                      <Box ref={ref}>
                        <UserOptions onClose={() => setShow(false)} />
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
                    setArticleEditorState(undefined)
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

        {!isConnected && (
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
            onClick={() => open()}
          >
            Connect Wallet
          </Button>
        )}
      </Grid>
    </Container>
  )
}

export default PublicationHeader

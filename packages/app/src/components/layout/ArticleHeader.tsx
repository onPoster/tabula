import React, { useEffect, useRef, useState } from "react"
import { Button, CircularProgress, Grid, Stack, Typography } from "@mui/material"
import { WalletBadge } from "@/components/commons/WalletBadge"
import { Publication } from "@/models/publication"
import { palette, typography } from "@/theme"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useArticleContext, usePublicationContext } from "@/services/publications/contexts"
import { UserOptions } from "@/components/commons/UserOptions"
import Avatar from "@/components/commons/Avatar"
import { useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers5/react"
import { ArticleFormSchema, UpdateArticleFormSchema } from "@/schemas/article.schema"
import useArticles from "@/services/publications/hooks/useArticles"

type Props = {
  publication?: Publication
  type: "edit" | "new"
}

const ArticleHeader: React.FC<Props> = ({ publication, type }) => {
  const { open } = useWeb3Modal()
  const { publicationSlug } = useParams<{ publicationSlug: string }>()
  const { address, isConnected } = useWeb3ModalAccount()
  const navigate = useNavigate()
  const location = useLocation()

  const { setCurrentPath, ipfsLoading } = usePublicationContext()
  const { setStoreArticleContent, setDraftArticlePath, articleFormMethods } = useArticleContext()
  const { handleSubmit } = articleFormMethods
  const { createNewArticle, txLoading, updateArticle } = useArticles()
  const { create: createLoading, update: updateLoading } = txLoading

  const [show, setShow] = useState<boolean>(false)

  const isPreview = location.pathname.includes("preview")
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (location.pathname) {
      setCurrentPath(location.pathname)
    }
  }, [location, setCurrentPath])

  const handlePublishAction = () => {
    handleSubmit(onSubmitHandler)()
  }

  const handleNavigation = async () => {
    // refetch()
    // clearArticleState()
    navigate(`/${publicationSlug}`)
  }

  const handlePreview = () => {
    if (isPreview) {
      navigate(-1)
      setDraftArticlePath(undefined)
    } else {
      setStoreArticleContent(true)
      navigate(`../${type}/preview`)
    }
  }

  const onSubmitHandler = async (articleFields: ArticleFormSchema) => {
    if (articleFields.id) {
      return await updateArticle(publicationSlug as string, articleFields as UpdateArticleFormSchema)
    }
    await createNewArticle(publicationSlug as string, articleFields)
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
          direction="row"
          sx={{ cursor: "pointer", transition: "opacity 0.25s ease-in-out", "&:hover": { opacity: 0.6 } }}
          onClick={handleNavigation}
        >
          <Avatar width={31} height={31} publicationSlug={publicationSlug as string} />

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
          <Button variant="text" onClick={handlePreview} disabled={createLoading || updateLoading || ipfsLoading}>
            {isPreview ? "Edit" : "Preview"}
          </Button>

          <Button
            variant="contained"
            onClick={handlePublishAction}
            sx={{ fontSize: 14, py: "2px", minWidth: "unset" }}
            disabled={createLoading || updateLoading || ipfsLoading}
          >
            {(createLoading || updateLoading) && <CircularProgress size={20} sx={{ marginRight: 1 }} />}
            Publish
          </Button>
        </Stack>
        {!isConnected ? (
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
        ) : (
          address && (
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
                  <Stack ref={ref}>
                    <UserOptions onClose={() => setShow(false)} />
                  </Stack>
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

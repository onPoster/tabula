import React from "react"
import { Box } from "@mui/material"
import { SxProps, Theme } from "@mui/material/styles"
interface PostProps {
  address?: string
  link: string
  sx?: SxProps<Theme>
}

const PostPreview: React.FC<PostProps> = ({ address, link, sx = [] }) => {
  return (
    <Box sx={[...(Array.isArray(sx) ? sx : [sx])]}>
      {/* <Link to={link}>
        <Box
          sx={{
            alignItems: "stretch",
            borderRadius: 1,
            color: "initial",
            display: "flex",
            transition: "background 0.25s ease-in-out",
            "&:hover": {
              bgcolor: palette.whites[600],
              cursor: "pointer",
            },
          }}
        >
          <Box
            sx={{
              backgroundColor: palette.grays[100],
              borderRadius: 1,
              display: "flex",
              overflow: "hidden",
              width: 256,
              "& img": {
                height: "100%",
                objectFit: "cover",
              },
            }}
          >
            {post.image && <img src={post.image} alt={post.title} />}
          </Box>
          <Box sx={{ ml: 3, py: 2, pr: 2 }}>
            <Box sx={{ alignItems: "content", display: "flex", mb: 2 }}>
              <Box
                sx={{
                  borderRadius: 999,
                  bgcolor: palette.grays[200],
                  border: `1px solid ${palette.grays[200]}`,
                  height: 32,
                  mr: 1,
                  width: 32,
                }}
              >
                {post.image && <img src={post.image} alt={post.title && post.title} />}
              </Box>
              <Typography fontFamily={typography.fontFamilies.sans} fontWeight={700}>
                {post.authors ? post.authors : "Gnosis Guild"}
              </Typography>
              {address && (
                <Box
                  sx={{
                    bgcolor: palette.secondary[200],
                    borderRadius: 1,
                    color: theme.palette.secondary.main,
                    display: "inline-flex",
                    ml: 1,
                    px: 1,
                  }}
                >
                  {shortAddress(address)}
                </Box>
              )}
            </Box>
            <Typography
              variant="h6"
              component="h3"
              color="text.secondary"
              fontFamily={typography.fontFamilies.sans}
              fontWeight={700}
              lineHeight="1"
            >
              {post.title ? post.title : "Gossip of the Old World"}
            </Typography>
            <Typography color={palette.grays[800]} lineHeight="125%">
              {post.description ? post.description : "Cooperatives, gaming guilds, and the networks to come"}
            </Typography>
            {post.description}
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                mt: 2,
              }}
            >
              {post.postedOn}
              {post.tags && (
                <Box component="ul" sx={{ ml: 2 }}>
                  {post.tags.map((tag, index) => (
                    <Box
                      key={tag}
                      component="li"
                      sx={{
                        bgcolor: palette.secondary[200],
                        borderRadius: 1,
                        color: theme.palette.secondary.main,
                        display: "inline-flex",
                        ml: index > 0 ? 1 : 0,
                        px: 1,
                      }}
                    >
                      {tag}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Link> */}
    </Box>
  )
}

export default PostPreview

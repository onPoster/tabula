import React from "react"
import { Avatar, Chip, Grid, Typography } from "@mui/material"
import { styled } from "@mui/styles"
import { palette, typography } from "../../theme"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import { Publications } from "../../models/publication"
import DeterministicAvatar from "./DeterministicAvatar"
import usePublication from "../../services/publications/hooks/usePublication"

const PublicationItemContainer = styled(Grid)({
  minHeight: 105,
  background: palette.grays[100],
  borderRadius: 4,
  padding: "10px 20px",
  cursor: "pointer",
  transition: "background 0.25s ease-in-out",
  "&:hover": {
    background: palette.grays[200],
  },
})
const PublicationIconGrid = styled(Grid)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#91908e",
})

type PublicationItemProps = {
  publication: Publications
  onClick: () => void
}

const PublicationItem: React.FC<PublicationItemProps> = ({ publication, onClick }) => {
  const { title, tags } = publication
  const { imageSrc } = usePublication(publication.id || "")

  return title ? (
    <PublicationItemContainer container alignItems={"center"} onClick={onClick}>
      <Grid item xs={11}>
        <Grid container flexDirection={"column"} gap={1}>
          <Grid item>
            <Grid container gap={1} alignItems="center">
              {imageSrc ? (
                <Avatar sx={{ width: 30, height: 30 }} src={imageSrc} />
              ) : (
                <DeterministicAvatar hash={publication.hash} width={30} height={30} />
              )}

              <Typography fontFamily={typography.fontFamilies.sans} variant="subtitle1" fontWeight={600}>
                {title}
              </Typography>
            </Grid>
          </Grid>
          {tags && tags.length > 0 && (
            <Grid item>
              <Grid container gap={1}>
                {tags.map((tag, index) => (
                  <Chip label={tag} size="small" key={index} />
                ))}
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
      <PublicationIconGrid item xs={1}>
        <ArrowForwardIosIcon />
      </PublicationIconGrid>
    </PublicationItemContainer>
  ) : null
}

export default PublicationItem

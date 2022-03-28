import React from "react"
import { Avatar, Chip, Grid, Typography } from "@mui/material"
import { styled } from "@mui/styles"
import { palette, typography } from "../../theme"
import * as blockies from "blockies-ts"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"

const PublicationItemContainer = styled(Grid)({
  minHeight: 105,
  background: palette.grays[100],
  borderRadius: 4,
  padding: "10px 20px",
  cursor: "pointer",
})
const PublicationIconGrid = styled(Grid)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#91908e",
})

const PublicationItem: React.FC = () => {
  const defaultAvatar = blockies.create({ seed: "0xd18D34a9c8C3F053b72E290C48e02bBF73D13d82" }).toDataURL()
  return (
    <PublicationItemContainer container alignItems={"center"}>
      <Grid item xs={11}>
        <Grid container flexDirection={"column"} gap={1}>
          <Grid item>
            <Grid container gap={2} alignItems="center">
              <Avatar sx={{ width: 30, height: 30 }} src={defaultAvatar} />
              <Typography fontFamily={typography.fontFamilies.sans} variant="subtitle1" fontWeight={600}>
                Gnosis Guild
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container gap={1}>
              <Chip label="defi" size="small" />
              <Chip label="smart contracts" size="small" />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <PublicationIconGrid item xs={1}>
        <ArrowForwardIosIcon />
      </PublicationIconGrid>
    </PublicationItemContainer>
  )
}

export default PublicationItem

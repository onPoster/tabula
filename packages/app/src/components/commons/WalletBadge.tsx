import React from "react"
import { styled } from "@mui/styles"
import { Avatar, Grid, Typography } from "@mui/material"
import * as blockies from "blockies-ts"
import { palette, typography } from "../../theme"
import { shortAddress } from "../../utils/string"

const WalletAddressContainer = styled(Grid)({
  background: palette.secondary[100],
  borderRadius: 4,
  padding: "4px 8px",
  boxSizing: "border-box",
})

export const WalletBadge: React.FC<{ address: string }> = ({ address }) => {
  const avatarSrc = blockies.create({ seed: address }).toDataURL()
  return (
    <Grid container alignItems={"center"} gap={1}>
      <Grid item>
        <Avatar src={avatarSrc} sx={{ width: 24, height: 24 }} />
      </Grid>
      <WalletAddressContainer item>
        <Typography color={palette.secondary[800]} fontFamily={typography.fontFamilies.sans} fontWeight={600}>{shortAddress(address)}</Typography>
      </WalletAddressContainer>
    </Grid>
  )
}

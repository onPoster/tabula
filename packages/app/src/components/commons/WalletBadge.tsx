import React from "react"
import { styled } from "@mui/styles"
import { Avatar, Box, Stack, Typography } from "@mui/material"
import * as blockies from "blockies-ts"
import { palette, typography } from "../../theme"
import { shortAddress } from "../../utils/string"
import { useNotification } from "../../hooks/useNotification"

const WalletAddressContainer = styled(Box)({
  background: palette.secondary[100],
  borderRadius: 4,
  padding: "4px 8px",
  boxSizing: "border-box",
})

type WalletBadgeProps = {
  address: string
  hover?: boolean
  copyable?: boolean
}

export const WalletBadge: React.FC<WalletBadgeProps> = ({ address, hover, copyable }) => {
  const avatarSrc = blockies.create({ seed: address.toLowerCase() }).toDataURL()
  const openNotification = useNotification()

  const handleAddressClick = () => {
    if (copyable) {
      navigator.clipboard.writeText(address)
      openNotification({
        message: "Copied to clipboard",
        variant: "success",
      })
    }
  }
  return (
    <Stack
      alignItems={"center"}
      direction="row"
      spacing={1}
      sx={{
        "&:hover": {
          opacity: hover ? 0.8 : null,
        },
      }}
    >
      <Avatar src={avatarSrc} sx={{ width: 24, height: 24 }} />
      <WalletAddressContainer onClick={handleAddressClick}>
        <Typography
          color={palette.secondary[800]}
          fontFamily={typography.fontFamilies.sans}
          fontWeight={600}
          sx={{ cursor: copyable ? "pointer" : "cursor" }}
        >
          {shortAddress(address).toLowerCase()}
        </Typography>
      </WalletAddressContainer>
    </Stack>
  )
}

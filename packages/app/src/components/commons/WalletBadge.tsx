import React from "react"
import { Avatar, Box, Typography } from "@mui/material"
import * as blockies from "blockies-ts"
import { useNotification } from "@/hooks/useNotification"
import { typography } from "@/theme"
import { shortAddress } from "@/utils/string-handler"

type WalletBadgeProps = {
  copyable?: boolean
  address: string
  hover?: boolean
}

export const WalletBadge: React.FC<WalletBadgeProps> = ({ address, copyable }) => {
  const avatarSrc = blockies.create({ seed: address.toLowerCase() }).toDataURL()

  const openNotification = useNotification()

  const handleAddressClick = async () => {
    if (copyable) {
      navigator.clipboard.writeText(address)

      openNotification({
        message: "Copied to clipboard",
        variant: "success",
      })
    }
  }
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Avatar
        src={avatarSrc}
        sx={{
          width: 24,
          height: 24,
          cursor: "pointer",
          "&:hover": {
            opacity: 0.8,
          },
          marginRight: 2,
        }}
        onClick={handleAddressClick}
      />
      <Typography sx={{ fontFamily: typography.fontFamilies.monospace, whiteSpace: "nowrap" }} variant="body2">
        {shortAddress(address).toLowerCase()}
      </Typography>
    </Box>
  )
}

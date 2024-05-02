import React from "react"
import { Avatar } from "@mui/material"
import * as blockies from "blockies-ts"
import { useNotification } from "@/hooks/useNotification"

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
    <Avatar
      src={avatarSrc}
      sx={{
        width: 24,
        height: 24,
        cursor: "pointer",
        "&:hover": {
          opacity: 0.8,
        },
      }}
      onClick={handleAddressClick}
    />
  )
}

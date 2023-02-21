import React, { useEffect, useState } from "react"
import { styled } from "@mui/styles"
import { Avatar, Box, Stack, Typography } from "@mui/material"
import * as blockies from "blockies-ts"
import { palette, typography } from "../../theme"
import { shortAddress } from "../../utils/string"
import { useNotification } from "../../hooks/useNotification"
import { useWeb3React } from "@web3-react/core"
import { lookupAddress } from "../../services/ens"

type WalletBadgeProps = {
  copyable?: boolean
  address: string
  hover?: boolean
}

export const WalletBadge: React.FC<WalletBadgeProps> = ({ address, hover, copyable }) => {
  const avatarSrc = blockies.create({ seed: address.toLowerCase() }).toDataURL()
  const { connector, active, chainId } = useWeb3React()

  const [ensName, setEnsName] = useState<string>()
  const openNotification = useNotification()

  useEffect(() => {
    const fetchData = async () => {
      if (address && active) {
        const provider = await connector?.getProvider()
        if (provider != null) {
          const ensName = await lookupAddress(provider, address)
          setEnsName(ensName ?? undefined)
        }
      }
    }

    fetchData().catch(console.error)
  }, [active, address, connector, ensName, chainId])

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

import React, { useEffect, useState } from "react"
import { styled } from "@mui/styles"
import { Avatar, Box, Stack, Typography } from "@mui/material"
import * as blockies from "blockies-ts"
import { palette, typography } from "../../theme"
import { shortAddress } from "../../utils/string"
import { useNotification } from "../../hooks/useNotification"
import { ethers } from "ethers"
import { useWeb3React } from "@web3-react/core"

type WalletBadgeProps = {
  copyable?: boolean
  address: string
  hover?: boolean
}

const WalletAddressContainer = styled(Box)({
  background: palette.secondary[100],
  borderRadius: 4,
  padding: "4px 8px",
  boxSizing: "border-box",
})

export const WalletBadge: React.FC<WalletBadgeProps> = ({ address, hover, copyable }) => {
  const avatarSrc = blockies.create({ seed: address.toLowerCase() }).toDataURL()
  const { connector, active } = useWeb3React()

  const [ensName, setEnsName] = useState<string | null>(null)
  const openNotification = useNotification()

  useEffect(() => {
    const fetchData = async () => {
      if (!ensName && address && active) {
        const provider = await connector?.getProvider()
        const web3Provider = new ethers.providers.Web3Provider(provider)
        const names = await web3Provider.lookupAddress(address)
        setEnsName(names)
      }
    }

    fetchData().catch(console.error)
  }, [active, address, connector, ensName])

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
          {ensName ?? shortAddress(address).toLowerCase()}
        </Typography>
      </WalletAddressContainer>
    </Stack>
  )
}

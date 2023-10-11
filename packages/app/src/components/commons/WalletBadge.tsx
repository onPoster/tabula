import React, { useEffect } from "react"

import { Avatar } from "@mui/material"
import * as blockies from "blockies-ts"

import { useNotification } from "../../hooks/useNotification"
import { useWeb3React } from "@web3-react/core"
import { useEnsContext } from "../../services/ens/context"
import useENS from "../../services/ens/hooks/useENS"

type WalletBadgeProps = {
  copyable?: boolean
  address: string
  hover?: boolean
}

export const WalletBadge: React.FC<WalletBadgeProps> = ({ address, hover, copyable }) => {
  const { lookupAddress } = useENS()
  const avatarSrc = blockies.create({ seed: address.toLowerCase() }).toDataURL()
  const { connector, active, chainId } = useWeb3React()
  const { setEnsName } = useEnsContext()

  const openNotification = useNotification()

  useEffect(() => {
    const fetchData = async () => {
      if (address && active) {
        const provider = await connector?.getProvider()
        if (provider != null) {
          const ens = await lookupAddress(provider, address)
          setEnsName(ens)
        }
      }
    }

    fetchData().catch(console.error)
  }, [active, address, connector, chainId, setEnsName, lookupAddress])

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

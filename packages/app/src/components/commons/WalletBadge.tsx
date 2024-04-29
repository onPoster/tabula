import React, { useEffect } from "react"
import { Avatar } from "@mui/material"
import * as blockies from "blockies-ts"
import { useNotification } from "@/hooks/useNotification"
import { useEnsContext } from "@/services/ens/context"
import useENS from "@/services/ens/hooks/useENS"
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers5/react"

type WalletBadgeProps = {
  copyable?: boolean
  address: string
  hover?: boolean
}

export const WalletBadge: React.FC<WalletBadgeProps> = ({ address, copyable }) => {
  const { lookupAddress } = useENS()
  const avatarSrc = blockies.create({ seed: address.toLowerCase() }).toDataURL()
  const { walletProvider } = useWeb3ModalProvider()
  const { isConnected, chainId } = useWeb3ModalAccount()
  const { setEnsName } = useEnsContext()

  const openNotification = useNotification()

  useEffect(() => {
    const fetchData = async () => {
      if (address && isConnected) {
        if (walletProvider != null) {
          const ens = await lookupAddress(walletProvider, address)
          setEnsName(ens)
        }
      }
    }

    fetchData().catch(console.error)
  }, [isConnected, address, chainId, setEnsName, lookupAddress, walletProvider])

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

import React from "react"
import { Box, Grid, Typography } from "@mui/material"
import { styled } from "@mui/styles"
import { palette, typography } from "../../theme"

const WalletContainer = styled(Grid)({
  boxSizing: "border-box",
  borderRadius: 4,
  minHeight: 52,
  padding: "8px 16px",
  background: "#4F4D4A1A",
})

const WalletIconContainer = styled(Grid)({
  background: " #FFFFFF",
  border: "2px solid rgba(170, 131, 47, 0.5)",
  boxSizing: "border-box",
  width: 36,
  height: 36,
  borderRadius: "100%",
})

type WalletButtonProps = {
  walletName: string
  icon?: string

  onClick: () => void
}

const WalletButton: React.FC<WalletButtonProps> = ({ icon, walletName, onClick }) => {
  return (
    <WalletContainer
      container
      alignItems={"center"}
      justifyContent={"flex-start"}
      style={{ gap: 8, cursor: "pointer" }}
      onClick={onClick}
    >
      <WalletIconContainer item alignItems={"center"} justifyContent={"center"} display="flex">
        {icon && (
          <Box
            component="img"
            sx={{
              height: 20,
              width: 20,
            }}
            alt={`${walletName}`}
            src={icon}
          />
        )}
      </WalletIconContainer>
      <Grid item>
        <Typography
          fontFamily={typography.fontFamilies.sans}
          color={palette.secondary[1000]}
          variant="h6"
          style={{ margin: 0 }}
        >
          {walletName}
        </Typography>
      </Grid>
    </WalletContainer>
  )
}

export default WalletButton

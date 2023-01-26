import React from "react"
import { Avatar, Stack, Typography } from "@mui/material"
import * as blockies from "blockies-ts"
import { palette, typography } from "../../theme"
import { shortAddress } from "../../utils/string"

export const UserBadge: React.FC<{ address: string; hover?: boolean }> = ({ address, hover }) => {
  const avatarSrc = blockies.create({ seed: address.toLowerCase() }).toDataURL()
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
      <Avatar src={avatarSrc} sx={{ width: 32, height: 32 }} />
      <Stack spacing={0.5}>
        {/* Can add "display name" in future */}
        {false && (
          <Typography
            color={palette.grays[800]}
            fontFamily={typography.fontFamilies.sans}
            fontWeight={600}
            lineHeight={1}
          >
            {shortAddress(address).toLowerCase()}
          </Typography>
        )}
        <Typography
          color={palette.grays[800]}
          fontFamily={typography.fontFamilies.monospace}
          fontSize={11}
          lineHeight={1}
        >
          {address}
        </Typography>
      </Stack>
    </Stack>
  )
}

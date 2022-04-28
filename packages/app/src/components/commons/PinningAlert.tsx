import { Box, Grid, styled, Typography } from "@mui/material"
import React from "react"
import { palette, typography } from "../../theme"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import { useLocation, useNavigate } from "react-router-dom"
import { usePublicationContext } from "../../services/publications/contexts"

const PinningAlertContainer = styled(Box)({
  background: palette.secondary[200],
  borderRadius: 4,
  cursor: "pointer",
  padding: 24,
})

const StyledButton = styled(Box)({
  background: palette.secondary[200],
  borderRadius: 4,
  cursor: "pointer",
  padding: 8,
})

export const PinningAlert: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { setCurrentPath } = usePublicationContext()
  return (
    <PinningAlertContainer>
      <Grid container gap={2} py={3} px={2} flexDirection="column">
        <Grid item sx={{ display: "flex", alignItems: "center" }}>
          <WarningAmberIcon color="secondary" sx={{ marginRight: 1 }} />
          <Typography
            fontFamily={typography.fontFamilies.sans}
            variant="h6"
            sx={{ margin: 0 }}
            color={palette.secondary[1000]}
          >
            Warning: Pinning Service is not Configured
          </Typography>
        </Grid>

        <Grid item>
          <Typography variant="body1" fontWeight={700} color={palette.secondary[1000]}>
            It is not recommended to publish an article without a configured pinning service. Without a configured
            pinning service, your transactions will be much more expensive.
          </Typography>
        </Grid>
        <Grid item>
          <StyledButton>
            <Typography
              variant="body1"
              fontFamily={typography.fontFamilies.sans}
              fontWeight={700}
              color={palette.secondary[1000]}
              onClick={() => {
                navigate("/pinning")
                setCurrentPath(location.pathname)
              }}
            >
              Setup Pinning Service
            </Typography>
          </StyledButton>
        </Grid>
      </Grid>
    </PinningAlertContainer>
  )
}

import React from "react"
import { Container, ContainerProps, styled } from "@mui/material"

const StyledViewContainer = styled(Container)(({ theme }) => ({
  [`${theme.breakpoints.down("md")}`]: {
    padding: "0px 24px",
  },

  [`${theme.breakpoints.up("lg")}`]: {
    padding: "0",
  },
}))

export const ViewContainer: React.FC<ContainerProps> = ({ children, ...props }) => {
  return <StyledViewContainer {...props}>{children}</StyledViewContainer>
}

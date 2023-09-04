import React from "react"
import { styled } from "@mui/material"

const Link = styled("a")({
  display: "flex",
  textDecoration: "none",
  "&:active": {
    color: "unset",
  },
})

interface ExternalLinkProps {
  link: string
  children: React.ReactNode
  // pass className to allowlocal style overrides
  style?: React.CSSProperties
  className?: string
}

export const ExternalLink = ({ link, children, style }: ExternalLinkProps): JSX.Element => {
  return (
    <Link style={style} href={link} rel="noreferrer noopener" target="_blank">
      {children}
    </Link>
  )
}

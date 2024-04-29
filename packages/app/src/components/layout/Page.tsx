import Header from "@/components/layout/Header"
import { Box } from "@mui/material"
import { useLocation } from "react-router-dom"
import theme, { palette } from "@/theme"

type Props = {
  title?: string
  showBadge?: boolean
  children: React.ReactNode
}

const Page: React.FC<Props> = ({ children, showBadge }) => {
  const location = useLocation()
  const logoColor = location.pathname === "/" ? palette.whites[1000] : theme.palette.text.primary
  return (
    <>
      <Header logoColor={logoColor} showBadge={showBadge} />
      <Box component="main" sx={{ pb: 12 }}>
        {children}
      </Box>
    </>
  )
}

export default Page

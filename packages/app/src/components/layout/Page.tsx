import Header from "./Header"
import { Box } from "@mui/material"
import { useLocation } from "react-router-dom"
import theme, { palette } from "../../theme"

type Props = {
  title?: string
  address?: string
}

const Page: React.FC<Props> = ({ children, address }) => {
  const location = useLocation()
  return (
    <>
      <Header logoColor={location.pathname === "/" ? palette.whites[1000] : theme.palette.text.primary} />
      <Box component="main" sx={{ pb: 12 }}>
        {children}
      </Box>
    </>
  )
}

export default Page

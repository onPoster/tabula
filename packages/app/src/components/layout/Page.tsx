
import Header from "./Header"
import { Box, CssBaseline, ThemeProvider } from "@mui/material"
import { useLocation } from "react-router-dom"
import theme, { palette } from "../../theme"
import { day } from "../../theme/day"

type Props = {
  title?: string
  address?: string
}

const Page: React.FC<Props> = ({ children, address }) => {
  const location = useLocation();
  return (
    <ThemeProvider theme={day}>
      <CssBaseline />
      <Header logoColor={location.pathname === "/" ? palette.whites[1000] : theme.palette.text.primary}/>
      <Box component="main" sx={{pb: 12}}>
        {children}
      </Box>
    </ThemeProvider>
  )
}

export default Page

import { useLocation } from "react-router-dom"
import { Box, CssBaseline, ThemeProvider } from "@mui/material"
import { day } from "../../theme/day"
import Header from "./Header"
import theme, { palette } from "../../theme"

type Props = {
  title?: string
  address?: string
}

const Page: React.FC<Props> = ({ children }) => {
  const location = useLocation();

  return (
    <ThemeProvider theme={day}>
      <CssBaseline />
      <Header logoColor={location.pathname == "/" ? palette.whites[1000] : theme.palette.text.primary}/>
      <Box component="main" sx={{pb: 12}}>
        {children}
      </Box>
    </ThemeProvider>
  )
}

export default Page

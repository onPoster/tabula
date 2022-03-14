import { useLocation } from "react-router-dom"
import { CssBaseline, ThemeProvider } from "@mui/material"
import { day } from "../../theme/day"
import Header from "./Header"
import { palette } from "../../theme"

type Props = {
  title?: string
  address?: string
}

const Page: React.FC<Props> = ({ children }) => {
  const location = useLocation();

  return (
    <ThemeProvider theme={day}>
      <CssBaseline />
      <Header logoColor={location.pathname == "/" ? palette.whites[1000] : 'text.primary'}/>
      <main>{children}</main>
    </ThemeProvider>
  )
}

export default Page

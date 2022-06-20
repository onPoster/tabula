import Header from "./Header"
import { Box } from "@mui/material"
import { useLocation } from "react-router-dom"
import theme, { palette } from "../../theme"
import { useEffect } from "react"
import { usePosterContext } from "../../services/poster/context"

type Props = {
  title?: string
  showBadge?: boolean
}

const Page: React.FC<Props> = ({ children, showBadge }) => {
  const location = useLocation()
  const { setIsIndexing } = usePosterContext()

  useEffect(() => {
    setIsIndexing(false)
  }, [setIsIndexing])
  return (
    <>
      <Header
        logoColor={location.pathname === "/" ? palette.whites[1000] : theme.palette.text.primary}
        showBadge={showBadge}
      />
      <Box component="main" sx={{ pb: 12 }}>
        {children}
      </Box>
    </>
  )
}

export default Page

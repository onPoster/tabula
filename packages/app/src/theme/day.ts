import theme, { palette } from "../theme"
import { createTheme } from "@mui/material/styles"

export const day = createTheme(theme, {
  palette: {
    text: {
      primary: palette.grays[1000],
      secondary: palette.grays[900],
    },
  },
})

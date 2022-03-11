import theme, { palette } from "../theme"
import { createTheme } from "@mui/material/styles"

export const night = createTheme(theme, {
  palette: {
    text: {
      primary: palette.whites[1000],
    },
  },
})

import theme, { palette } from "../theme"
import { createTheme } from "@mui/material/styles"

export const night = createTheme(theme, {
  palette: {
    mode: 'dark',
    text: {
      primary: palette.whites[1000],
      secondary: palette.whites[900],
    },
  },
})

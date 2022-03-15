import { createTheme } from "@mui/material/styles"
import paperTextureDay from "../assets/images/paper-texture-800-day.jpg"
import avertaFont from "../assets/fonts/averta-normal.woff2"
import avertaBoldFont from "../assets/fonts/averta-bold.woff2"
import appareoExtraLightFont from "../assets/fonts/appareo-extralight.woff2"
import appareoLightFont from "../assets/fonts/appareo-light.woff2"
import appareoMediumFont from "../assets/fonts/appareo-medium.woff2"
import appareoBlackFont from "../assets/fonts/appareo-black.woff2"

declare module "*.woff2"

export const palette = {
  grays: {
    1000: "#242424",
    800: "#4B4A46CC", // 80%
    600: "#4B4A4699", // 60%
    400: "#4B4A4666", // 40%
    200: "#4B4A4633", // 20%
    100: "#4B4A461A", // 10%
    50: "#4B4A460D", // 5%
  },
  whites: {
    1000: "#ffffff",
    800: "#ffffffCC", // 80%
    600: "#ffffff99", // 60%
    400: "#ffffff66", // 40%
    200: "#ffffff33", // 20%
    100: "#ffffff1A", // 10%
    50: "#ffffff0D", // 5%
  },
  primary: {
    1000: "#CA6303",
    800: "#CA6303CC", // 80%
    600: "#CA630399", // 60%
    500: "#CA630380", // 50%
    400: "#CA630366", // 40%
    200: "#CA630333", // 20%
    100: "#CA63031A", // 10%
    50: "#CA63030D", // 5%
  },
  secondary: {
    1000: "#AA832F",
    800: "#AA832FCC", // 80%
    600: "#AA832F99", // 60%
    500: "#AA832F80", // 50%
    400: "#AA832F66", // 40%
    200: "#AA832F33", // 20%
    100: "#AA832F1A", // 10%
    50: "#AA832F0D", // 5%
  },
}

export const typography = {
  fontFamilies: {
    sans: `'Averta', 'Avenir', sans-serif`,
    displaySerif: `'Appareo', 'Garamond', serif`,
    monospace: `'Roboto Mono', monospace`,
    textSerif: `'Averia Serif Libre', 'Garamond', cursive;`,
  },
}

let theme = createTheme({
  palette: {
    primary: {
      main: palette.primary[1000],
    },
    secondary: {
      main: palette.secondary[1000],
    },
  },
  typography: {
    // Base Typography
    fontFamily: typography.fontFamilies.textSerif,
    h1: {
      fontFamily: typography.fontFamilies.displaySerif,
      fontSize: '4rem',
      fontWeight: 400,
      marginBlockStart: '2.5rem',
      lineHeight: 1,
    },
    h2: {
      fontFamily: typography.fontFamilies.displaySerif,
      fontSize: '2.5rem',
      fontWeight: 600,
      marginBlockStart: '2.5rem',
      lineHeight: 1,
    },
    h3: {
      fontSize: '2.25rem',
      marginBlockStart: '2rem',
      fontFamily: typography.fontFamilies.textSerif,
    },
    h4: {
      fontSize: '2rem',
      marginBlockStart: '2rem',
      fontFamily: typography.fontFamilies.textSerif,
    },
    h5: {
      fontSize: '1.75rem',
      marginBlockStart: '2rem',
      fontFamily: typography.fontFamilies.textSerif,
    },
    h6: {
      fontSize: '1.5rem',
      marginBlockStart: '2rem',
      fontFamily: typography.fontFamilies.textSerif,
    },
    subtitle1: {
      fontFamily: typography.fontFamilies.textSerif,
      fontSize: "1.5em",
    },
    subtitle2: {
      fontFamily: typography.fontFamilies.textSerif,
      fontSize: "1.25em",
    },
    body1: {
      fontFamily: typography.fontFamilies.textSerif,
      fontSize: "1em",
      lineHeight: 1.75,
    },
    body2: {
      fontFamily: typography.fontFamilies.textSerif,
      fontSize: "0.75em",
      lineHeight: 1.75,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Averta';
          font-weight: 500;
          src: local('Averta'), local('Averta-Regular'), url(${avertaFont}) format('woff2');
        }
        @font-face {
          font-family: 'Averta';
          font-weight: 700;
          src: local('Averta'), local('Averta-Regular'), url(${avertaBoldFont}) format('woff2');
        }
        @font-face {
          font-family: 'Appareo';
          font-weight: 200;
          src: local('Appareo'), local('Appareo-Extra-Light'), url(${appareoExtraLightFont}) format('woff2');
        }
        @font-face {
          font-family: 'Appareo';
          font-weight: 400;
          src: local('Appareo'), local('Appareo-Light'), url(${appareoLightFont}) format('woff2');
        }
        @font-face {
          font-family: 'Appareo';
          font-weight: 600;
          src: local('Appareo'), local('Appareo-Medium'), url(${appareoMediumFont}) format('woff2');
        }
        @font-face {
          font-family: 'Appareo';
          font-weight: 800;
          src: local('Appareo'), local('Appareo-Black'), url(${appareoBlackFont}) format('woff2');
        }
        body {
          background-image: url(${paperTextureDay});
          background-size: 400px;
        }
        a {
          text-decoration: none;
          color: inherit;
        }
        img {
          width: 100%;
        }
      `,
    },
  },
})

theme = createTheme(theme, {
  // Responsive Typography
  typography: {
    h1: {
      [`${theme.breakpoints.down("lg")}`]: {
        fontSize: "5rem",
      },
      [`${theme.breakpoints.down("sm")}`]: {
        fontSize: "4rem",
      },
    },
    subtitle1: {
      [`${theme.breakpoints.down("lg")}`]: {
        fontSize: "1.25rem",
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.primary.main,
          borderRadius: 2,
          boxShadow: "0 4px rgba(0,0,0,0.1), inset 0 -4px 4px #97220166",
          color: palette.whites[1000],
          fontFamily: typography.fontFamilies.sans,
          fontSize: "1rem",
          fontWeight: 700,
          position: "relative",
          textTransform: "none",
        },
        sizeSmall: {
          fontSize: "0.75rem",
        },
      },
    },
  },
})

export default theme

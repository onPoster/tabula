import { createTheme } from '@mui/material/styles';
import paperTextureDay from "../assets/images/paper-texture-800-day.jpg";
import avertaFont from "../assets/fonts/averta-normal.woff2";
import avertaBoldFont from "../assets/fonts/averta-bold.woff2";
import appareoExtraLightFont from "../assets/fonts/appareo-extralight.woff2";
import appareoLightFont from "../assets/fonts/appareo-light.woff2";
import appareoMediumFont from "../assets/fonts/appareo-medium.woff2";
import appareoBlackFont from "../assets/fonts/appareo-black.woff2";

declare module '*.woff2';

export const palette = {
  grays: {
    1000: '#242424',
    800: '#4B4A46CC', // 80%
    600: '#4B4A4699', // 60%
    400: '#4B4A4666', // 40%
    200: '#4B4A4633', // 20%
    100: '#4B4A461A', // 10%
    50: '#4B4A460D', // 5%
  },
  whites: {
    1000: '#ffffff',
    800: '#ffffffCC', // 80%
    600: '#ffffff99', // 60%
    400: '#ffffff66', // 40%
    200: '#ffffff33', // 20%
    100: '#ffffff1A', // 10%
    50: '#ffffff0D', // 5%
  }
}

export const typography = {
  fontFamilies: {
    sans: `'Averta', 'Avenir', sans-serif`,
    displaySerif: `'Appareo', 'Garamond', serif`,
    textSerif: `'Averia Serif Libre', 'Garamond', cursive;`,
  }
}

let theme = createTheme({
  palette: {
    primary: {
      main: '#CA6303',
    },
    secondary: {
      main: '#AA832F',
    },
  },
  typography: {
    fontFamily: typography.fontFamilies.sans,
    h1: {
      fontFamily: typography.fontFamilies.displaySerif,
      fontWeight: 400,
      lineHeight: 1,
    },
    h2: {
      fontFamily: typography.fontFamilies.displaySerif,
      fontWeight: 600,
      lineHeight: 1,
    },
    h3: {
      fontFamily: typography.fontFamilies.sans,
    },
    h4: {
      fontFamily: typography.fontFamilies.sans,
    },
    h5: {
      fontFamily: typography.fontFamilies.sans,
    },
    h6: {
      fontFamily: typography.fontFamilies.sans,
    },
    subtitle1: {
      fontFamily: typography.fontFamilies.textSerif,
      fontSize: '1.5em',
    },
    subtitle2: {
      fontFamily: typography.fontFamilies.textSerif,
      fontSize: '1.25em',
    },
    body1: {
      fontFamily: typography.fontFamilies.textSerif,
      fontSize: '1em',
      lineHeight: 1.75,
    },
    body2: {
      fontFamily: typography.fontFamilies.textSerif,
      fontSize: '0.75em',
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
          background-size: 800px;
        }
      `,
    },
  }
})

theme = createTheme(theme, {
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.primary.main,
          borderRadius: 4,
          boxShadow: '0 4px rgba(0,0,0,0.2), inset 0 -4px 4px #97220166',
          fontSize: '1rem',
          fontWeight: 700,
          position: 'relative',
          textTransform: 'none',
        },
      },
    }
  },
});

export default theme;
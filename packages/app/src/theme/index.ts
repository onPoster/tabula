/* eslint-disable array-callback-return */
import { createTheme } from "@mui/material/styles"
import paperTextureDay from "../assets/images/paper-texture-800-day.jpg"
import avertaFont from "../assets/fonts/averta-normal.woff2"
import avertaSemiBoldFont from "../assets/fonts/averta-semibold.woff2"
import avertaBoldFont from "../assets/fonts/averta-bold.woff2"

declare module "*.woff2"

export const palette = {
  grays: {
    1000: "#242424",
    900: "#4B4A46E6", // 90%
    800: "#4B4A46CC", // 80%
    600: "#4B4A4699", // 60%
    400: "#4B4A4666", // 40%
    200: "#4B4A4633", // 20%
    100: "#4B4A461A", // 10%
    50: "#4B4A460D", // 5%
  },
  whites: {
    1000: "#ffffff",
    900: "#ffffffE6", // 90%
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

const fontFamilies = {
  sans: `'Averta', 'Avenir', sans-serif`,
  serif: `'Source Serif Pro', 'Garamond', cursive;`,
  monospace: `'Roboto Mono', monospace`,
}

export const typography: any = {
  fontFamilies: fontFamilies,
  fontFamily: fontFamilies.serif,
  h1: {
    fontFamily: fontFamilies.serif,
    fontSize: "3rem",
    fontWeight: 600,
    marginBlockStart: "2.5rem",
    lineHeight: 1,
  },
  h2: {
    fontFamily: fontFamilies.serif,
    fontSize: "2rem",
    fontWeight: 500,
    marginBlockStart: "2.5rem",
    lineHeight: 1,
  },
  h3: {
    fontSize: "1.75rem",
    marginBlockStart: "2rem",
    fontFamily: fontFamilies.serif,
    fontWeight: 500,
  },
  h4: {
    fontSize: "1.5rem",
    marginBlockStart: "2rem",
    fontFamily: fontFamilies.serif,
    fontWeight: 500,
  },
  h5: {
    fontSize: "1.25rem",
    marginBlockStart: "2rem",
    fontFamily: fontFamilies.serif,
    fontWeight: 500,
  },
  h6: {
    fontSize: "1.125rem",
    marginBlockStart: "2rem",
    fontFamily: fontFamilies.serif,
    fontWeight: 500,
  },
  subtitle1: {
    fontFamily: fontFamilies.serif,
    fontSize: "1.5em",
  },
  subtitle2: {
    fontFamily: fontFamilies.serif,
    fontSize: "1.25em",
  },
  body1: {
    fontFamily: fontFamilies.serif,
    fontSize: "1em",
    lineHeight: 1.75,
  },
  body2: {
    fontFamily: fontFamilies.serif,
    fontSize: "0.75em",
    lineHeight: 1.75,
  },
}

const createArticleStyles = () => {
  const styleOutput: string[] = []
  ;["h1", "h2", "h3", "h4", "h5", "h6"].map((tag) => {
    const headingStyles = `
    .editor ${tag} {
      font-family: ${typography[tag].fontFamily};
      font-size: ${typography[tag].fontSize};
      line-height: ${typography[tag].lineHeight};
    }
    `
    styleOutput.push(headingStyles)
  })
  return styleOutput.join(" ")
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
    ...typography,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Averta';
          font-weight: 300;
          src: local('Averta'), local('Averta-Regular'), url(${avertaFont}) format('woff2');
        }
        @font-face {
          font-family: 'Averta';
          font-weight: 500;
          src: local('Averta'), local('Averta-SemiBold'), url(${avertaSemiBoldFont}) format('woff2');
        }
        @font-face {
          font-family: 'Averta';
          font-weight: 700;
          src: local('Averta'), local('Averta-Regular'), url(${avertaBoldFont}) format('woff2');
        }
        body {
          &:after {
            content: "";
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-size: 400px;
            background-image: url(${paperTextureDay});
            opacity: 0.7;
            z-index: -1;
          }
        }
        ${createArticleStyles()}
        .code {
          font-family: "Courier New", Courier, monospace;
          white-space: pre;
          background-color: ${palette.grays[800]};
          color: white;
          padding-left: 0.2rem;
          padding-right: 0.2rem;
        }
        .strikethrough {
          text-decoration-line: line-through;
        }
        .bold {
          font-weight: bold
        }
        .italic {
          font-style: italic
        }
        p {
          font-family: ${typography.body1.fontFamily};
          font-size: ${typography.body1.fontSize};
          line-height: ${typography.body1.lineHeight};
        }
        .divider {
          height: 28px;
          display: flex;
          align-items: center;
        }
        .divider:before {
          content: "";
          height: 1px;
          width: 100%;
          background-color: ${palette.grays[600]};
        }
        a {
          text-decoration: none;
          color: inherit;
        }
        figure {
          margin: 0;
        }
        img {
          width: 100%;
        }
        em, i {
          font-style: italic;
        }
        blockquote {
          padding: 0 1rem;
          border-left: 2px solid ${palette.grays[200]};
          color: ${palette.grays[800]};
        }
        pre, :not(pre) > code {
          background-color: ${palette.grays[800]};
          border-radius: 4px;
          color: ${palette.whites[1000]};
          font-family: ${typography.fontFamilies.monospace};
          margin-bottom: 1rem;
          overflow: auto;
          padding: 1rem;
        }
        .rich-editor-placeholder{
          font-family: ${fontFamilies.serif} !important;
          font-size: 16px !important;
          line-height: 1.75 !important;
        }
        .public-DraftStyleDefault-pre {
          background-color: initial;
          border-radius: initial;
          color: initial;
          font-family: initial;
          margin-bottom: initial;
          overflow: initial;
          padding: initial;
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
        fontSize: "2.25rem",
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
        // ".MuiButton-contained": {
        //   backgroundColor: theme.palette.secondary.main,
        //   borderRadius: 4,
        //   boxShadow: "0 4px rgba(0,0,0,0.1), inset 0 -4px 4px #97220166",
        //   color: palette.whites[1000],
        //   "&:hover": {
        //     backgroundColor: palette.primary[800],
        //     boxShadow: "0 4px rgba(0,0,0,0.1), inset 0 -4px 4px #97220100",
        //   },
        // },
        // "& .MuiButton-outlined": {
        //   borderRadius: 4,
        //   // boxShadow: "0 4px rgba(0,0,0,0.1), inset 0 -4px 4px #97220166",
        //   color: "#000000",
        //   border: ` 2px solid ${palette.grays[400]}`,
        //   // "&:hover": {
        //   //   backgroundColor: palette.primary[800],
        //   //   boxShadow: "0 4px rgba(0,0,0,0.1), inset 0 -4px 4px #97220100",
        //   // },
        // },
        root: {
          fontFamily: typography.fontFamilies.sans,
          fontSize: "1rem",
          fontWeight: 500,
          position: "relative",
          textTransform: "none",
        },

        sizeSmall: {
          fontSize: "0.75rem",
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: palette.primary[1000],
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        maxWidthSm: {
          "&.MuiContainer-maxWidthSm": {
            maxWidth: 650,
          },
        },
        maxWidthMd: {
          "&.MuiContainer-maxWidthMd": {
            maxWidth: 900,
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: palette.grays[600],
          fontFamily: typography.fontFamilies.sans,
          textTransform: "capitalize",
          fontWeight: "bold",
          fontSize: "1.5rem",
          "&:hover": {
            opacity: 0.8,
          },
        },
        sizeSmall: {
          fontSize: "1rem",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: palette.secondary[800],
          fontFamily: typography.fontFamilies.sans,
          fontSize: "1rem",
          letterSpacing: 2,
          lineHeight: 1,
          textTransform: "uppercase",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: palette.grays[50],
          backdropFilter: "blur(2px)",
          fontFamily: typography.fontFamilies.sans,
          "& .MuiOutlinedInput-input:not(textarea)": {
            height: "auto",
            paddingTop: 12,
            paddingBottom: 12,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "0 !important",
          border: "1px solid",
          borderColor: "rgba(217, 212, 173, 0.3)",
          position: "relative",
          "&::before": {
            content: '" "',
            position: "absolute",
            zIndex: 1,
            top: "2px",
            left: "2px",
            right: "2px",
            bottom: "2px",
            border: "1px solid rgba(217, 212, 173, 0.3)",
            pointerEvents: "none",
          },
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: palette.whites[1000],
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          padding: "4px 8px",
          color: palette.whites[1000],
          background: palette.secondary[800],
          height: "auto",
          borderRadius: 4,
          lineHeight: 1,
          "& .MuiChip-deleteIcon": {
            marginLeft: 4,
            marginRight: 0,
            color: palette.whites[1000],
          },
        },
        avatar: {
          display: "contents !important",
        },
        label: {
          paddingLeft: 0,
          paddingRight: 0,
        },
      },
    },
  },
})

export default theme

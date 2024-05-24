/* eslint-disable array-callback-return */
import { createTheme } from "@mui/material/styles"
import paperTextureDay from "@/assets/images/paper-texture-800-day.jpg"
import avertaFont from "@/assets/fonts/averta-normal.woff2"
import avertaSemiBoldFont from "@/assets/fonts/averta-semibold.woff2"
import avertaBoldFont from "@/assets/fonts/averta-bold.woff2"
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank"
import CheckBoxIcon from "@mui/icons-material/CheckBox"
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
      pre {
        background: #1f2937;
        border-radius: 0.5rem;
        color: #fff;
        font-size: 12px;
        font-family: JetBrainsMono, monospace;
        padding: 0.75rem 1rem;

      
        .hljs-comment,
        .hljs-quote {
          color: #616161;
        }
      
        .hljs-variable,
        .hljs-template-variable,
        .hljs-attribute,
        .hljs-tag,
        .hljs-name,
        .hljs-regexp,
        .hljs-link,
        .hljs-name,
        .hljs-selector-id,
        .hljs-selector-class {
          color: #f98181;
        }
      
        .hljs-number,
        .hljs-meta,
        .hljs-built_in,
        .hljs-builtin-name,
        .hljs-literal,
        .hljs-type,
        .hljs-params {
          color: #fbbc88;
        }
      
        .hljs-string,
        .hljs-symbol,
        .hljs-bullet {
          color: #b9f18d;
        }
      
        .hljs-title,
        .hljs-section {
          color: #faf594;
        }
      
        .hljs-keyword,
        .hljs-selector-tag {
          color: #70cff8;
        }
      
        .hljs-emphasis {
          font-style: italic;
        }
      
        .hljs-strong {
          font-weight: 700;
        }
      }
      .ProseMirror {
        outline: none;
        padding: 10px;
      }
      .ProseMirror .is-editor-empty:first-child::before,
      .ProseMirror .is-empty::before {
        content: attr(data-placeholder);
        float: left;
        color: hsl(0, 0%, 80%); 
        pointer-events: none;
        height: 0;
      }
      .ProseMirror img {
        transition: filter 0.1s ease-in-out;
        &:hover {
          cursor: pointer;
          filter: brightness(90%);
        }
        &.ProseMirror-selectednode {
          outline: 3px solid #ededed;
          filter: brightness(90%);
        }
      }
      .img-placeholder {
        position: relative;
        &:before {
          content: "";
          box-sizing: border-box;
          position: absolute;
          top: 50%;
          left: 50%;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 3px solid #ccc;
          border-top-color: #333;
          animation: spinning 0.6s linear infinite;
        }
      }
      @keyframes spinning {
        to {
          transform: rotate(360deg);
        }
      }
      ul[data-type="taskList"] li > label {
        margin-right: 0.2rem;
        user-select: none;
      }
      
      ul[data-type="taskList"] li > label input[type="checkbox"] {
        -webkit-appearance: none;
        appearance: none;
        background-color: #f0f0f0;
        margin: 0;
        cursor: pointer;
        width: 1.2em;
        height: 1.2em;
        position: relative;
        top: 5px;
        border: 1px solid #ddd;
        margin-right: 0.3rem;
        display: grid;
        place-content: center;
      }
      
      ul[data-type="taskList"] li > label input[type="checkbox"]:hover {
        background-color: #CA630399;
      }
      
      ul[data-type="taskList"] li > label input[type="checkbox"]:active {
        background-color: #CA630399;
      }
      
      ul[data-type="taskList"] li > label input[type="checkbox"]::before {
        content: "";
        width: 0.65em;
        height: 0.65em;
        transform: scale(0);
        transition: 120ms transform ease-in-out;
        box-shadow: inset 1em 1em;
        transform-origin: center;
        clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
      }
      
      ul[data-type="taskList"] li > label input[type="checkbox"]:checked::before {
        transform: scale(1);
      }
      
      ul[data-type="taskList"] li[data-checked="true"] > div > p {
        color: #757575;
        text-decoration: line-through;
        text-decoration-thickness: 2px;
      }
      


      .tippy-box {
        max-width: 400px !important;
      }
      .ProseMirror:not(.dragging) .ProseMirror-selectednode {
        outline: none !important;
        background-color: #dae0e6; 
        transition: background-color 0.2s;
        box-shadow: none;
      }
      .drag-handle {
        position: fixed;
        opacity: 1;
        transition: opacity ease-in 0.2s;
        border-radius: 0.25rem;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10' style='fill: rgba(0, 0, 0, 0.5)'%3E%3Cpath d='M3,2 C2.44771525,2 2,1.55228475 2,1 C2,0.44771525 2.44771525,0 3,0 C3.55228475,0 4,0.44771525 4,1 C4,1.55228475 3.55228475,2 3,2 Z M3,6 C2.44771525,6 2,5.55228475 2,5 C2,4.44771525 2.44771525,4 3,4 C3.55228475,4 4,4.44771525 4,5 C4,5.55228475 3.55228475,6 3,6 Z M3,10 C2.44771525,10 2,9.55228475 2,9 C2,8.44771525 2.44771525,8 3,8 C3.55228475,8 4,8.44771525 4,9 C4,9.55228475 3.55228475,10 3,10 Z M7,2 C6.44771525,2 6,1.55228475 6,1 C6,0.44771525 6.44771525,0 7,0 C7.55228475,0 8,0.44771525 8,1 C8,1.55228475 7.55228475,2 7,2 Z M7,6 C6.44771525,6 6,5.55228475 6,5 C6,4.44771525 6.44771525,4 7,4 C7.55228475,4 8,4.44771525 8,5 C8,5.55228475 7.55228475,6 7,6 Z M7,10 C6.44771525,10 6,9.55228475 6,9 C6,8.44771525 6.44771525,8 7,8 C7.55228475,8 8,8.44771525 8,9 C8,9.55228475 7.55228475,10 7,10 Z'%3E%3C/path%3E%3C/svg%3E");
        background-size: calc(0.5em + 0.375rem) calc(0.5em + 0.375rem);
        background-repeat: no-repeat;
        background-position: center;
        width: 1.2rem;
        height: 1.5rem;
        z-index: 50;
        cursor: grab;
      }
      .drag-handle:hover {
        background-color: #ccc; 
        transition: background-color 0.2s;
      }
      .drag-handle:active {
        background-color: #bbb; 
        transition: background-color 0.2s;
        cursor: grabbing;
      }
      .drag-handle.hide {
        opacity: 0;
        pointer-events: none;
      }
      @media screen and (max-width: 600px) {
        .drag-handle {
          display: none;
          pointer-events: none;
        }
      }
      .dark .drag-handle {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10' style='fill: rgba(255, 255, 255, 0.5)'%3E%3Cpath d='M3,2 C2.44771525,2 2,1.55228475 2,1 C2,0.44771525 2.44771525,0 3,0 C3.55228475,0 4,0.44771525 4,1 C4,1.55228475 3.55228475,2 3,2 Z M3,6 C2.44771525,6 2,5.55228475 2,5 C2,4.44771525 2.44771525,4 3,4 C3.55228475,4 4,4.44771525 4,5 C4,5.55228475 3.55228475,6 3,6 Z M3,10 C2.44771525,10 2,9.55228475 2,9 C2,8.44771525 2.44771525,8 3,8 C3.55228475,8 4,8.44771525 4,9 C4,9.55228475 3.55228475,10 3,10 Z M7,2 C6.44771525,2 6,1.55228475 6,1 C6,0.44771525 6.44771525,0 7,0 C7.55228475,0 8,0.44771525 8,1 C8,1.55228475 7.55228475,2 7,2 Z M7,6 C6.44771525,6 6,5.55228475 6,5 C6,4.44771525 6.44771525,4 7,4 C7.55228475,4 8,4.44771525 8,5 C8,5.55228475 7.55228475,6 7,6 Z M7,10 C6.44771525,10 6,9.55228475 6,9 C6,8.44771525 6.44771525,8 7,8 C7.55228475,8 8,8.44771525 8,9 C8,9.55228475 7.55228475,10 7,10 Z'%3E%3C/path%3E%3C/svg%3E");
      }

        *:focus-visible {
          outline: none;
          box-shadow: none;
          border-color: transparent;
        }
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
          min-height: 28px;
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
          text-decoration: underline;
          text-underline-offset: 3px;
          color: ${palette.grays[900]};
          &:hover {
            color: ${palette.primary[1000]};
          };
          cursor: pointer;
          transition: color 0.3s;
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
        h1 { font-size: 2.25rem; font-weight: 600; }
        h2 { font-size: 2rem; font-weight: 600; }
        h3 { font-size: 1.75rem; font-weight: 600; }
        ul: { padding: 0, margin: '8px 0' },
        ol: { padding: 0, margin: '8px 0' },
        li: {
          listStyle: 'none', 
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center'
        },
        'ul[data-type="taskList"] li': {
          paddingLeft: '32px', 
          position: 'relative'
        },
        'ul[data-type="taskList"] li::before': {
          content: '""',
          display: 'block',
          width: '16px',
          height: '16px',
          position: 'absolute',
          left: '0',
          top: '50%',
          transform: 'translateY(-50%)',
          border: '2px solid #ccc',
          borderRadius: '4px',
          backgroundColor: '#fff'
        },
        'ul[data-type="taskList"] li[data-checked="true"]::before': {
          backgroundColor: '#6200ea', 
          borderColor: '#6200ea'
        },
        'ul[data-type="taskList"] li[data-checked="true"]': {
          color: '#aaa', 
          textDecoration: 'line-through'
        },
      
        'ul.list-disc': {
          paddingLeft: '32px'
        },
        'ul.list-disc li': {
          listStyleType: 'disc',
          listStylePosition: 'inside'
        },
       
        'ol.list-decimal': {
          paddingLeft: '32px'
        },
        'ol.list-decimal li': {
          listStyleType: 'decimal',
          listStylePosition: 'inside'
        },
        'li[data-type="taskList"]': {
          display: 'flex',
          alignItems: 'center',
          marginBottom: '10px'
        },
        'li[data-type="taskList"] .MuiCheckbox-root': {
          padding: 0,
          marginRight: '8px',
          color: '#757575'
        },
        'li[data-type="taskList"] input[type="checkbox"]': {
          display: 'none' 
        },
        'li[data-type="taskList"] .checkbox-icon': {
          cursor: 'pointer',
          display: 'inline-flex'
        },
        'li[data-type="taskList"][data-checked="false"] .checkbox-icon': {

          content: url(${CheckBoxOutlineBlankIcon});
        },
        'li[data-type="taskList"][data-checked="true"] .checkbox-icon': {

          content: url(${CheckBoxIcon});
        }

        blockquote {
          border-left: 4px solid #ccc;
          padding-left: 16px;
          font-style: italic;
        }
        .ProseMirror {
          outline: none;
          padding: 10px; 
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

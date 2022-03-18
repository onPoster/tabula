import ReactMarkdown from "markdown-to-jsx"
import { List, ListItem, Typography } from "@mui/material"
import Link from "@mui/material/Link"
import { palette, typography } from "../../theme"

const options = {
  overrides: {
    h1: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: "h1",
        fontFamily: typography.fontFamilies.sans,
      },
    },
    h2: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: "h3",
        component: "h2",
      },
    },
    h3: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: "h4",
        component: "h3",
      },
    },
    h4: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: "h5",
        component: "h4",
      },
    },
    h5: {
      component: Typography,
      props: { gutterBottom: true, variant: "h5" },
    },
    h6: {
      component: Typography,
      props: { gutterBottom: true, variant: "h6" },
    },
    p: {
      component: Typography,
      props: { gutterBottom: true, paragraph: true },
    },
    a: { component: Link },
    ul: {
      component: List,
      dense: true,
      props: {
        sx: {
          mb: 2,
          pl: 0,
        },
      },
    },
    li: {
      component: ListItem,
      props: {
        sx: {
          display: "list-item",
          listStylePosition: "inside",
          listStyleType: "circle",
          pl: 0,
          py: "0.25rem",
        },
      },
    },
    pre: {
      props: {
        style: {
          background: palette.grays[800],
          borderRadius: 4,
          color: palette.whites[1000],
          fontFamily: typography.fontFamilies.monospace,
          marginBottom: "1rem",
          overflow: "auto",
          paddingBottom: "1rem",
          paddingTop: "1rem",
        },
      },
    },
  },
}

export const Markdown: React.FC = (props: any) => {
  return <ReactMarkdown options={options} {...props} />
}

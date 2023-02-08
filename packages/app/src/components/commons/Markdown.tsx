import ReactMarkdown from "markdown-to-jsx"
import { Box, List, ListItem, Typography } from "@mui/material"
import Link from "@mui/material/Link"

const options = {
  disableParsingRawHTML: true,
  overrides: {
    h1: {
      component: Typography,
      props: {
        gutterBottom: true,
        fontWeight: 600,
        variant: "h1",
        contentEditable: true,
      },
    },
    h2: {
      component: Typography,
      props: {
        gutterBottom: true,
        fontWeight: 600,
        variant: "h3",
        component: "h2",
        contentEditable: true,
      },
    },
    h3: {
      component: Typography,
      props: {
        gutterBottom: true,
        fontWeight: 600,
        variant: "h4",
        component: "h3",
        contentEditable: true,
      },
    },

    h4: {
      component: Typography,
      props: {
        gutterBottom: true,
        fontWeight: 600,
        variant: "h5",
        component: "h4",
        contentEditable: true,
      },
    },
    h5: {
      component: Typography,
      props: { gutterBottom: true, fontWeight: 600, variant: "h5", contentEditable: true },
    },
    h6: {
      component: Typography,
      props: { gutterBottom: true, fontWeight: 600, variant: "h6", contentEditable: true },
    },
    p: {
      component: Typography,
      props: { gutterBottom: true, paragraph: true, fontSize: "1.175rem", contentEditable: true },
    },
    code: {
      component: Box,
      props: {
        component: "code",
        padding: "0.25rem",
        ml: "0.125rem",
        mr: "0.125rem",
        fontSize: 13,
        contentEditable: true,
      },
    },
    a: { component: Link, props: { target: "_self" } },
    ol: {
      component: List,
      dense: true,
      props: {
        sx: {
          mb: 2,
          pl: 2,
          "& li": {
            listStyleType: "decimal",
          },
        },
      },
    },
    ul: {
      component: List,
      dense: true,
      props: {
        sx: {
          mb: 2,
          pl: 2,
        },
      },
    },
    li: {
      component: ListItem,
      props: {
        sx: {
          display: "list-item",
          listStylePosition: "outside",
          listStyleType: "circle",
          pl: 0,
          py: "0.25rem",
        },
      },
    },
  },
}

export const Markdown: React.FC<{
  [key: string]: any
  children: string
}> = (props) => {
  return <ReactMarkdown options={options} {...props} />
}

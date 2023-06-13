import ReactMarkdown from "markdown-to-jsx"
import { Box, List, ListItem, Typography } from "@mui/material"
import Link from "@mui/material/Link"

type NodeType = {
  type: string
  props: {
    children?: React.ReactNode | React.ReactNode[]
  }
}

const convert = (node: NodeType) => {
  const { children } = node.props

  if (!children) return null

  const content = Array.isArray(children) ? children[0] : children

  if (node.type === "em") {
    return <em>{content}</em>
  }
  if (node.type === "strong") {
    return <strong>{content}</strong>
  }
  if (node.type === "del") {
    return <del>{content}</del>
  }
}

const options = {
  disableParsingRawHTML: false,
  forceBlock: true,
  forceWrapper: true,
  overrides: {
    h1: {
      component: Typography,
      props: {
        gutterBottom: true,
        fontWeight: 600,
        variant: "h1",
      },
    },
    h2: {
      component: Typography,
      props: {
        gutterBottom: true,
        fontWeight: 600,
        variant: "h3",
        component: "h2",
      },
    },
    h3: {
      component: Typography,
      props: {
        gutterBottom: true,
        fontWeight: 600,
        variant: "h4",
        component: "h3",
      },
    },

    h4: {
      component: Typography,
      props: {
        gutterBottom: true,
        fontWeight: 600,
        variant: "h5",
        component: "h4",
      },
    },
    h5: {
      component: Typography,
      props: { gutterBottom: true, fontWeight: 600, variant: "h5" },
    },
    h6: {
      component: Typography,
      props: { gutterBottom: true, fontWeight: 600, variant: "h6" },
    },
    p: {
      component: Typography,
      props: { gutterBottom: true, paragraph: true, fontSize: "1.175rem" },
    },
    code: {
      component: Box,
      props: {
        component: "code",
        padding: "0.25rem",
        ml: "0.125rem",
        mr: "0.125rem",
        fontSize: 13,
      },
    },
    a: { component: Link, props: { target: "_blank" } },
    u: {
      props: {
        style: {
          textDecoration: "underline",
        },
      },
      component: ({ children, ...props }: { children?: React.ReactNode }) => {
        return (
          <u {...props}>
            {Array.isArray(children)
              ? children.map((child, index) => (typeof child === "string" ? child : convert(child)))
              : children}
          </u>
        )
      },
    },
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

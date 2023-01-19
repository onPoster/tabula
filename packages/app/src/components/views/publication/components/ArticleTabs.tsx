import { Tabs, Tab, styled } from "@mui/material"
import React, { useEffect, useState } from "react"
import theme from "../../../../theme"

const ArticleTab = styled(Tab)({
  fontSize: "1rem",
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  minWidth: "auto",
})

export const ARTICLE_TABS = [
  { label: "Write", value: "write" },
  { label: "Preview", value: "preview" },
]

type ArticleTabsProps = {
  onChange: (tab: "write" | "preview") => void
}

const ArticleTabs: React.FC<ArticleTabsProps> = ({ onChange }) => {
  const [currentTab, setCurrentTab] = useState<"write" | "preview">(
    ARTICLE_TABS[0].value as "write" | "preview",
  )

  const handleChange = (_event: React.SyntheticEvent, newValue: "write" | "preview") => {
    setCurrentTab(newValue)
  }

  useEffect(() => {
    if (currentTab) {
      onChange(currentTab)
    }
  }, [onChange, currentTab])

  return (
    <Tabs
      value={currentTab}
      onChange={handleChange}
      textColor="secondary"
      indicatorColor="secondary"
    >
      {ARTICLE_TABS.map(({ label, value }, index) => {
        return (
          <ArticleTab label={label} value={value} key={index} />
        )
      })}
    </Tabs>
  )
}

export default ArticleTabs
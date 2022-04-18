import { Tabs, Tab, styled } from "@mui/material"
import React, { useEffect, useState } from "react"
import { palette } from "../../../../theme"

const PublicationStyledTabs = styled(Tabs)({
  borderBottom: `2px solid ${palette.grays[400]}`,
})

export const PUBLICATIONS_TABS_OPTIONS = [
  { label: "Posts", value: "posts" },
  { label: "Permissions", value: "permissions" },
  { label: "Settings", value: "settings" },
]

type PublicationTabsProps = {
  onChange: (tab: "posts" | "permissions" | "settings") => void
}

const PublicationTabs: React.FC<PublicationTabsProps> = ({ onChange }) => {
  const [currentTab, setCurrentTab] = useState<"posts" | "permissions" | "settings">(
    PUBLICATIONS_TABS_OPTIONS[0].value as "posts" | "permissions" | "settings",
  )

  const handleChange = (event: React.SyntheticEvent, newValue: "posts" | "permissions" | "settings") => {
    setCurrentTab(newValue)
  }

  useEffect(() => {
    if (currentTab) {
      onChange(currentTab)
    }
  }, [onChange, currentTab])

  return (
    <PublicationStyledTabs
      value={currentTab}
      onChange={handleChange}
      textColor="secondary"
      indicatorColor="secondary"
      TabIndicatorProps={{
        style: {
          display: "none",
        },
      }}
    >
      {PUBLICATIONS_TABS_OPTIONS.map(({ label, value }, index) => (
        <Tab label={label} value={value} key={index} />
      ))}
    </PublicationStyledTabs>
  )
}

export default PublicationTabs

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
export const PUBLICATIONS_TABS_WITHOUT_EDIT_OPTIONS = [
  { label: "Posts", value: "posts" },
  { label: "Permissions", value: "permissions" },
]

type PublicationTabsProps = {
  couldEdit?: boolean
  onChange: (tab: "posts" | "permissions" | "settings") => void
}

const PublicationTabs: React.FC<PublicationTabsProps> = ({ couldEdit, onChange }) => {
  console.log("couldEdit", couldEdit)
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
      {couldEdit &&
        PUBLICATIONS_TABS_OPTIONS.map(({ label, value }, index) => <Tab label={label} value={value} key={index} />)}

      {!couldEdit &&
        PUBLICATIONS_TABS_WITHOUT_EDIT_OPTIONS.map(({ label, value }, index) => (
          <Tab label={label} value={value} key={index} />
        ))}
    </PublicationStyledTabs>
  )
}

export default PublicationTabs

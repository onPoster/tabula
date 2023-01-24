import { Tabs, Tab, styled } from "@mui/material"
import React, { useEffect, useState } from "react"
import { palette } from "../../../../theme"

const PublicationStyledTabs = styled(Tabs)({
  borderBottom: `2px solid ${palette.grays[400]}`,
})

export const PUBLICATIONS_TABS_OPTIONS = [
  { label: "Articles", value: "articles" },
  { label: "Permissions", value: "permissions" },
  { label: "Settings", value: "settings" },
]
export const PUBLICATIONS_TABS_WITHOUT_EDIT_OPTIONS = [
  { label: "Articles", value: "articles" },
  { label: "Permissions", value: "permissions" },
]

export const PUBLICATIONS_TABS_WITH_DELETE_OPTIONS = [
  { label: "Articles", value: "articles" },
  { label: "Permissions", value: "permissions" },
  { label: "Settings", value: "settings" },
]

type PublicationTabsProps = {
  couldEdit?: boolean
  couldDelete?: boolean
  onChange: (tab: "articles" | "permissions" | "settings") => void
}

const PublicationTabs: React.FC<PublicationTabsProps> = ({ couldEdit, couldDelete, onChange }) => {
  const [currentTab, setCurrentTab] = useState<"articles" | "permissions" | "settings">(
    PUBLICATIONS_TABS_OPTIONS[0].value as "articles" | "permissions" | "settings",
  )

  const handleChange = (_event: React.SyntheticEvent, newValue: "articles" | "permissions" | "settings") => {
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
      {(couldEdit || couldDelete) &&
        PUBLICATIONS_TABS_OPTIONS.map(({ label, value }, index) => <Tab label={label} value={value} key={index} />)}

      {!couldEdit &&
        !couldDelete &&
        PUBLICATIONS_TABS_WITHOUT_EDIT_OPTIONS.map(({ label, value }, index) => (
          <Tab label={label} value={value} key={index} />
        ))}
    </PublicationStyledTabs>
  )
}

export default PublicationTabs

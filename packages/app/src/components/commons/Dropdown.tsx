import { Avatar, Box, Grid, Paper, styled, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import { palette, typography } from "../../theme"
import { DropdownOption, DropdownProps } from "../../models/dropdown"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import { findIndex } from "lodash"

const DropdownContainer = styled(Paper)({
  padding: "8px 12px",
  border: "none",
  borderRadius: "4px !important",
  position: "absolute",
  width: "100%",
  zIndex: 2,
})

const DropdownInput = styled(Grid)({
  background: palette.grays[50],
  backdropFilter: "blur(2px)",
  borderRadius: "4px",
  height: 47,
  padding: "8px 12px",
  border: `1px solid #b2b2b1`,
  justifyContent: "space-between",
  alignItems: "center",
  "&:hover": {
    border: `1px solid black`,
  },
})

const DropdownArrowContainer = styled(Grid)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s ease",
})

export const Dropdown: React.FC<DropdownProps> = ({ options, defaultValue, value, title, onSelected }) => {
  const [show, setShow] = useState<boolean>(false)
  const [currentSelected, setCurrentSelected] = useState<DropdownOption | undefined>(undefined)

  useEffect(() => {
    if (defaultValue && !currentSelected) {
      setCurrentSelected(defaultValue)
    }
  }, [currentSelected, defaultValue])

  useEffect(() => {
    if (value && !currentSelected && options.length) {
      const index = findIndex(options, { value })
      setCurrentSelected(options[index])
    }
  }, [currentSelected, options, value])

  useEffect(() => {
    if (currentSelected) {
      onSelected(currentSelected)
    }
  }, [currentSelected, onSelected])

  return (
    <Box style={{ position: "relative" }}>
      <DropdownInput container onClick={() => setShow(!show)}>
        <Grid item>
          {currentSelected && (
            <Grid container gap={2} alignItems="center">
              {currentSelected.icon && currentSelected.icon}
              <Typography
                sx={{
                  fontFamily: typography.fontFamilies.sans,
                }}
              >
                {currentSelected.label}
              </Typography>
            </Grid>
          )}
          {!currentSelected && (
            <Typography sx={{ color: palette.grays[800], fontSize: 16, fontFamily: typography.fontFamilies.sans }}>
              {title}
            </Typography>
          )}
        </Grid>
        <DropdownArrowContainer item style={{ transform: !show ? "rotate(0deg)" : "rotate(180deg)" }}>
          <KeyboardArrowDownIcon />
        </DropdownArrowContainer>
      </DropdownInput>
      {show && (
        <DropdownContainer>
          <Grid container flexDirection="column" gap={2}>
            {options.map((option, index) => (
              <Grid
                item
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  setCurrentSelected(option)
                  setShow(!show)
                }}
                key={index}
              >
                <Grid container gap={1} alignItems="center">
                  {option.icon && (
                    <Avatar sx={{ width: 28, height: 28, background: palette.grays[100] }}>{option.icon}</Avatar>
                  )}
                  <Typography variant="body1">{option.label}</Typography>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </DropdownContainer>
      )}
    </Box>
  )
}

import { Avatar, Box, Grid, Paper, styled, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import { palette } from "../../theme"
import { DropdownOption, DropdownProps } from "../../models/dropdown"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"

const DropdownContainer = styled(Paper)({
  padding: 12,
  border: "none",
  borderRadius: "4px !important",
  position: "absolute",
  width: "100%",
  zIndex: 2,
})

const DropdownInput = styled(Grid)({
  height: 56,
  background: "#e7e7e6",
  borderRadius: "4px",
  padding: 12,
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

export const Dropdown: React.FC<DropdownProps> = ({ options, defaultValue, onSelected }) => {
  const [show, setShow] = useState<boolean>(false)
  const [currentSelected, setCurrentSelected] = useState<DropdownOption | undefined>(undefined)

  useEffect(() => {
    if (defaultValue && !currentSelected) {
      setCurrentSelected(defaultValue)
    }
  }, [currentSelected, defaultValue])

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
              <Typography>{currentSelected.label}</Typography>
            </Grid>
          )}
          {!currentSelected && <Typography sx={{ color: palette.grays[800] }}>Select A Pinning Service</Typography>}
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

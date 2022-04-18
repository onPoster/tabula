import React from "react"
import { CheckboxProps, FormControlLabel, Checkbox, styled, Box } from "@mui/material"
import { palette } from "../../theme"

interface CustomCheckboxProps extends CheckboxProps {
  label: string
}

const CheckboxContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: 24,
  height: 24,
  borderRadius: 4,
  border: `2px solid ${palette.secondary[1000]}`,
  background: palette.whites[1000],
})
const CheckboxChecked = styled(Box)({
  width: 12,
  height: 12,
  borderRadius: 2,
  background: palette.secondary[1000],
})
export const CustomCheckbox: React.FC<CustomCheckboxProps> = (props) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          {...props}
          color="secondary"
          icon={<CheckboxContainer />}
          checkedIcon={
            <CheckboxContainer>
              <CheckboxChecked />
            </CheckboxContainer>
          }
        />
      }
      label={props.label}
    />
  )
}

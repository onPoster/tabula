import Select from "react-select/creatable"
import { OnChangeValue } from "react-select"
import React, { useEffect, useState } from "react"
import { palette, typography } from "../../theme"
import { CreateSelectOption } from "../../models/dropdown"
import { FormHelperText } from "@mui/material"

export interface CreateSelectProps {
  options?: CreateSelectOption[]
  onSelected?: (items: CreateSelectOption[]) => void
  value?: string[]
  placeholder?: string
  errorMsg?: string
  isAddress?: boolean
}

const customStyles = {
  control: (base: any, state: { isFocused: any }) => ({
    ...base,
    minHeight: "47px",
    background: palette.grays[50],
    backdropFilter: "blur(2px)",
    borderRadius: 4,
    border: state.isFocused ? `2px solid ${palette.primary[1000]}` : `1px solid rgba(0, 0, 0, 0.23)`,
    boxShadow: state.isFocused ? null : null,
    fontFamily: typography.fontFamilies.sans,
    fontSize: 16,
    "&:hover": {
      border: state.isFocused ? `2px solid ${palette.primary[1000]}` : `1px solid ${palette.grays[1000]}`,
    },
  }),
  menu: (base: any) => ({
    ...base,
    // override border radius to match the box
    borderRadius: 0,
    // kill the gap
    marginTop: 0,
  }),
  menuList: (base: any) => ({
    ...base,
    // kill the white space on first and last option
    padding: 0,
  }),
  multiValue: (base: any) => ({
    ...base,
    color: palette.whites[1000],
    background: palette.secondary[600],
    maxWidth: "calc(28% - 4px)",
    "&:hover": {
      background: palette.secondary[800],
    },
    "& > div": {
      color: `${palette.whites[1000]}`,
    },
    "& > div[role=button]:hover": {
      cursor: "pointer",
      color: palette.whites[1000],
      background: palette.secondary[600],
    },
  }),
}

export const CreatableSelect: React.FC<CreateSelectProps> = ({ options, onSelected, value, placeholder, errorMsg }) => {
  const [values, setValues] = useState<CreateSelectOption[]>([])

  useEffect(() => {
    if (value?.length) {
      const newValues = value.map((item) => {
        return { label: item, value: item }
      })
      setValues(newValues)
    }
  }, [value])

  const handleChange = (newValue: OnChangeValue<CreateSelectOption, any>) => {
    if (onSelected) {
      onSelected(newValue as CreateSelectOption[])
    }
    setValues(newValue as CreateSelectOption[])
  }

  return (
    <>
      <Select
        styles={customStyles}
        value={values}
        options={options}
        isMulti
        onChange={handleChange}
        placeholder={placeholder}
      />
      {errorMsg && (
        <FormHelperText sx={{ color: palette.secondary[1000], textTransform: "capitalize" }}>{errorMsg}</FormHelperText>
      )}
    </>
  )
}

import Select from "react-select/creatable"
import { OnChangeValue } from "react-select"
import { forwardRef, useEffect, useState } from "react"
import { palette, typography } from "@/theme"
import { CreateSelectOption } from "@/models/dropdown"
import { Box, FormHelperText } from "@mui/material"
import { useController } from "react-hook-form"

export interface CreateSelectProps {
  control: any
  name: string
  options?: CreateSelectOption[]
  onSelected?: (items: CreateSelectOption[]) => void
  value?: string[]
  placeholder?: string
  errorMsg?: string
  isAddress?: boolean
  limit?: number
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

export const CreatableSelect = forwardRef(({ control, name, options, placeholder, errorMsg }: CreateSelectProps) => {
  const {
    field: { onChange, onBlur, value, ref: inputRef },
    fieldState: { error },
  } = useController({
    name,
    control,
  })
  const [values, setValues] = useState<CreateSelectOption[]>([])

  useEffect(() => {
    if (value) {
      const formattedValues = value.map((val: any) => (typeof val === "string" ? { label: val, value: val } : val))
      setValues(formattedValues)
    }
  }, [value])

  const handleChange = (newValue: OnChangeValue<CreateSelectOption, any>) => {
    const list = newValue as CreateSelectOption[]

    onChange(list)
    setValues(list)
  }

  return (
    <Box>
      <Select
        ref={(e) => {
          inputRef(e)
        }}
        styles={customStyles}
        value={values}
        options={options}
        isMulti
        onChange={handleChange}
        onBlur={onBlur}
        placeholder={placeholder}
      />
      {error && (
        <FormHelperText sx={{ color: "error.main", textTransform: "capitalize" }}>
          {error.message || errorMsg}
        </FormHelperText>
      )}
    </Box>
  )
})

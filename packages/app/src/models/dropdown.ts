export interface DropdownOption {
  label: string
  value: string
  icon?: any
}

export interface DropdownProps {
  options: DropdownOption[]
  onSelected: (item: DropdownOption) => void
  defaultValue?: DropdownOption
}

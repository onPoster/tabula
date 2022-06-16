export interface DropdownOption {
  label: string
  value: string
  icon?: any
}

export interface DropdownProps {
  options: DropdownOption[]
  title: string
  onSelected: (item: DropdownOption) => void
  defaultValue?: DropdownOption
  value?: string
}

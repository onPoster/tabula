export interface DropdownOption {
  label: string
  value: string
  icon?: any
}

export type CreateSelectOption = Omit<DropdownOption, "icon">

export interface DropdownProps {
  options: DropdownOption[]
  title: string
  onSelected: (item: DropdownOption) => void
  defaultValue?: DropdownOption
  value?: string
}

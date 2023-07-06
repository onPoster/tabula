import { Box, BoxProps } from "@mui/material"

const NodeIcon = ({ ...props }: BoxProps) => {
  return (
    <Box width={24} height={24} {...props}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="12" fill="currentColor" fillOpacity="0.1" />
        <path
          d="M8.5 15C8.5 15.9665 7.7165 16.75 6.75 16.75C5.7835 16.75 5 15.9665 5 15C5 14.0335 5.7835 13.25 6.75 13.25C7.7165 13.25 8.5 14.0335 8.5 15ZM8.5 15H9C9.79565 15 10.5587 14.6839 11.1213 14.1213C11.6839 13.5587 12 12.7956 12 12C12 11.2044 12.3161 10.4413 12.8787 9.87868C13.4413 9.31607 14.2044 9 15 9H19M16.5 6.5L19 9M19 9L16.5 11.5"
          stroke="currentColor"
          strokeOpacity="0.8"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Box>
  )
}

export default NodeIcon

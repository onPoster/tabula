import { Box, BoxProps } from "@mui/material"

const SettingsIcon = ({ ...props }: BoxProps) => {
  return (
    <Box width={24} height={24} {...props}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%" }}>
        <path
          d="M12 16.5C14.4853 16.5 16.5 14.4853 16.5 12C16.5 9.51472 14.4853 7.5 12 7.5C9.51472 7.5 7.5 9.51472 7.5 12C7.5 14.4853 9.51472 16.5 12 16.5Z"
          stroke="currentColor"
          stroke-width="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17.2218 6.10303C17.4593 6.32178 17.6843 6.54678 17.8968 6.77803L20.4562 7.14365C20.8732 7.86788 21.1947 8.64308 21.4125 9.4499L19.8562 11.5218C19.8562 11.5218 19.8843 12.1593 19.8562 12.478L21.4125 14.5499C21.1957 15.3571 20.8742 16.1324 20.4562 16.8562L17.8968 17.2218C17.8968 17.2218 17.4562 17.6812 17.2218 17.8968L16.8562 20.4562C16.132 20.8732 15.3568 21.1946 14.55 21.4124L12.4781 19.8562C12.16 19.8843 11.84 19.8843 11.5218 19.8562L9.44996 21.4124C8.6428 21.1956 7.86747 20.8741 7.14371 20.4562L6.77809 17.8968C6.54684 17.678 6.32184 17.453 6.10309 17.2218L3.54371 16.8562C3.1267 16.1319 2.80527 15.3567 2.58746 14.5499L4.14371 12.478C4.14371 12.478 4.11559 11.8405 4.14371 11.5218L2.58746 9.4499C2.80426 8.64274 3.12574 7.8674 3.54371 7.14365L6.10309 6.77803C6.32184 6.54678 6.54684 6.32178 6.77809 6.10303L7.14371 3.54365C7.86794 3.12664 8.64314 2.80521 9.44996 2.5874L11.5218 4.14365C11.84 4.11552 12.16 4.11552 12.4781 4.14365L14.55 2.5874C15.3571 2.8042 16.1325 3.12568 16.8562 3.54365L17.2218 6.10303Z"
          stroke="currentColor"
          stroke-width="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Box>
  )
}

export default SettingsIcon

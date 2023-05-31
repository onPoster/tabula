import turndownService from "../services/turndown"
const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY

if (IPFS_GATEWAY == null) {
  throw new Error("REACT_APP_IPFS_GATEWAY is not set")
}

export function shortAddress(address: string) {
  return address.substr(0, 6) + "..." + address.substr(-4)
}

export function shortTitle(str: string, n: number) {
  return str.length > n ? str.substr(0, n - 1) + "..." : str
}

export const toBase64 = (file: File) =>
  new Promise((resolve: (result: string) => void) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
  })

export const convertToMarkdown = (html: string): string => {
  let htmlContent = html
  if (html.includes("img") && html.includes("src=")) {
    const regex = /src="/g
    htmlContent = html.replace(regex, `src="${IPFS_GATEWAY}/`)
  }
  const markdown = turndownService.turndown(htmlContent)
  return markdown
}

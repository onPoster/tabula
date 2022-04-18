export function shortAddress(address: string) {
  return address.substr(0, 6) + "..." + address.substr(-4)
}

export function shortTitle(str: string, n: number) {
  return str.length > n ? str.substr(0, n - 1) + "..." : str
}

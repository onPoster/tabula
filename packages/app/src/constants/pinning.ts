import { DropdownOption } from "../models/dropdown"
import { PinningService } from "../models/pinning"

export const PINNING_OPTIONS: DropdownOption[] = [
  {
    label: "Pinata",
    value: PinningService.PINATA,
  },
  {
    label: "Estuary",
    value: PinningService.ESTUARY,
  },
  {
    label: "Web3 Storage",
    value: PinningService.WEB3_STORAGE,
  },
  {
    label: "NFT Storage",
    value: PinningService.NFT_STORAGE,
  },
]

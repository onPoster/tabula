import { Pinning, PinningService } from "../models/pinning"

export const checkPinningRequirements = (pinning: Pinning | undefined): boolean => {
  return pinning && pinning.service === PinningService.NONE ? false : true
}

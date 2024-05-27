import { PinningService } from "@/models/pinning"

import * as yup from "yup"
import { InferType } from "yup"

export const pinningSchema = yup.object().shape({
  service: yup.string().oneOf(Object.values(PinningService)).required(),
  endpoint: yup.string().when("service", {
    is: (service: PinningService) => ![PinningService.NONE, PinningService.PUBLIC].includes(service),
    then: yup.string().required("API Endpoint Is A Required Field"),
    otherwise: yup.string().notRequired(),
  }),
  accessToken: yup.string().when("service", {
    is: (service: PinningService) => ![PinningService.NONE, PinningService.PUBLIC].includes(service),
    then: yup.string().required("Secret Access Token Is A Required Field"),
    otherwise: yup.string().notRequired(),
  }),
})

export type Pinning = InferType<typeof pinningSchema>

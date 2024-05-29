import { ethers } from "ethers"
import * as yup from "yup"

export interface PermissionFormSchema {
  articleCreate: boolean
  articleDelete: boolean
  articleUpdate: boolean
  publicationDelete: boolean
  publicationPermissions: boolean
  publicationUpdate: boolean
  account: string
}

export const permissionsSchema = yup.object({
  articleCreate: yup.boolean().default(false),
  articleDelete: yup.boolean().default(false),
  articleUpdate: yup.boolean().default(false),
  publicationDelete: yup.boolean().default(false),
  publicationPermissions: yup.boolean().default(false),
  publicationUpdate: yup.boolean().default(false),
  account: yup
    .string()
    .required("Account is required")
    .test("is-eth-address", "Please provide a valid address", (value) =>
      value ? ethers.utils.isAddress(value) : false,
    ),
})

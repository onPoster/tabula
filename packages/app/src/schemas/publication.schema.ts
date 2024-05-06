import * as yup from "yup"

export interface PublicationFormSchema {
  title: string
  description?: string
  tags?: { label: string; value: string }[]
  image?: File | undefined
}
export const publicationSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().optional(),
  image: yup.mixed<File | undefined>().optional(),
  tags: yup
    .array()
    .of(
      yup.object({
        label: yup.string().required("Label is required"),
        value: yup.string().required("Value is required"),
      }),
    )
    .max(5, "You can add up to 5 tags")
    .optional(),
})

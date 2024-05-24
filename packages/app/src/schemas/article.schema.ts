import * as yup from "yup"

export interface ArticleFormSchema {
  title: string
  article: string
  id?: string
  description?: string
  tags?: { label: string; value: string }[]
  image?: File | undefined
  lastUpdated?: string
}
export interface UpdateArticleFormSchema extends ArticleFormSchema {
  id: string
}

export const articleSchema = yup.object({
  title: yup.string().required("Title is required"),
  article: yup.string().required("Article is required"),
  id: yup.string().optional(),
  description: yup.string().optional(),
  lastUpdated: yup.string().optional(),
  image: yup.mixed<File | undefined | string>().optional(),
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

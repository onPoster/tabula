import { PublicationFormSchema } from "@/schemas/publication.schema"

export const generatePublicationBody = async (
  form: PublicationFormSchema,
  encodeImage: (file: File) => Promise<string | undefined>,
) => {
  // Transform the tags from { label, value } to just [value]
  const tags = form.tags?.map((tag) => tag.value)
  // Encode image
  const image = form.image ? await encodeImage(form.image) : undefined

  const publicationBody = {
    action: "publication/create",
    title: form.title,
    // Conditionally add properties if they exist
    ...(tags ? { tags } : {}),
    ...(form.description ? { description: form.description } : {}),
    ...(image ? { image } : {}),
  }

  return publicationBody
}

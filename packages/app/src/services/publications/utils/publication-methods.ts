import { PublicationAction } from "@/models/publication"
import { PermissionFormSchema } from "@/schemas/permission.schema"
import { PublicationFormSchema, UpdatePublicationFormSchema } from "@/schemas/publication.schema"

const processPublicationBody = async (
  form: PublicationFormSchema | UpdatePublicationFormSchema,
  action: PublicationAction,
  encodeImage: (file: File) => Promise<string | undefined>,
) => {
  const tags = form.tags?.map((tag) => tag.value)

  // Encode image if it's a File
  let image: string | undefined
  if (form.image instanceof File) {
    image = await encodeImage(form.image)
  } else if (typeof form.image === "string") {
    image = form.image
  } else {
    image = undefined
  }

  // Create publication body
  const publicationBody: Record<string, any> = {
    action,
    title: form.title,
    ...(tags ? { tags } : { tags: "" }),
    ...(form.description ? { description: form.description } : { description: " " }),
    ...(image ? { image } : { image: "" }),
  }

  // Add id if it's an update
  if ("id" in form) {
    publicationBody.id = form.id
  }

  return publicationBody
}

export const generatePublicationBody = async (
  form: PublicationFormSchema,
  encodeImage: (file: File) => Promise<string | undefined>,
) => {
  return processPublicationBody(form, "publication/create", encodeImage)
}

export const generateUpdatePublicationBody = async (
  form: UpdatePublicationFormSchema,
  encodeImage: (file: File) => Promise<string | undefined>,
) => {
  return processPublicationBody(form, "publication/update", encodeImage)
}

export const deletePublicationBody = async (id: string) => {
  return {
    action: "publication/delete",
    id,
  }
}
export const generatePermissionBody = async (publicationId: string, permissionFields: PermissionFormSchema) => {
  return {
    action: "publication/permissions",
    id: publicationId,
    account: permissionFields.account,
    permissions: {
      "article/create": permissionFields.articleCreate,
      "article/update": permissionFields.articleUpdate,
      "article/delete": permissionFields.articleDelete,
      "publication/delete": permissionFields.publicationDelete,
      "publication/update": permissionFields.publicationUpdate,
      "publication/permissions": permissionFields.publicationPermissions,
    },
  }
}

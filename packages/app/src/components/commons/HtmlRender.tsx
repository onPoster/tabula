import React from "react"
import DOMPurify from "dompurify"

export const HtmlRenderer: React.FC<{ htmlContent: string }> = ({ htmlContent }) => {
  const cleanHtmlContent = DOMPurify.sanitize(htmlContent)

  return <div dangerouslySetInnerHTML={{ __html: cleanHtmlContent }} />
}

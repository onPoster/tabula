import { EditorState, DraftHandleValue, Modifier, convertFromHTML, ContentState } from "draft-js"
import { marked } from "marked"

const useHandlePastedText = (
  editorState: EditorState,
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>,
) => {
  const isMarkdown = (text: string) => {
    // These are just some of the characters commonly used in markdown.
    const markdownCharacters = ["#", "*", "_", "~", "[", "]", "(", ")", "|", "`", ">", "-"]

    //markdown text
    for (let character of markdownCharacters) {
      if (text.includes(character)) {
        return true
      }
    }

    //If none of the markdown characters are found, we assume it is not markdown.
    return false
  }

  return (text: string, html: string | undefined, editorState: EditorState): DraftHandleValue => {
    // We obtain the current content and selection;
    const contentState = editorState.getCurrentContent()
    const selectionState = editorState.getSelection()

    let newContentState: ContentState

    if (isMarkdown(text)) {
      // you need to implement isMarkdown function
      // If the pasted text is Markdown, treat it as such
      const markdownHTML = marked(text) // Convert Markdown to HTML
      const contentBlockArray = convertFromHTML(markdownHTML) // Convert HTML to Draft.js blocks
      newContentState = ContentState.createFromBlockArray(contentBlockArray.contentBlocks, contentBlockArray.entityMap)
    } else {
      // If the pasted text is not Markdown, handle it as plain text
      newContentState = Modifier.replaceText(contentState, selectionState, text)
    }

    const newEditorState = EditorState.push(editorState, newContentState, "insert-characters")

    setEditorState(newEditorState)
    return "handled"
  }
}

export default useHandlePastedText

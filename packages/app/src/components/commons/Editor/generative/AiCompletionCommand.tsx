import { Check } from "@mui/icons-material"
import { useEditor } from "novel"
import { CommandGroup, CommandItem, CommandSeparator } from "./Command"
import { ReactComponent as TrashIcon } from "@/assets/images/trashIcon.svg"
import { ReactComponent as QuoteIcon } from "@/assets/images/quoteIcon.svg"

const AICompletionCommands = ({ completion, onDiscard }: { completion: string; onDiscard: () => void }) => {
  const { editor } = useEditor()
  return (
    <>
      <CommandGroup>
        <CommandItem
          className="gap-2 px-4"
          value="replace"
          onSelect={() => {
            if (editor) {
              const selection = editor.view.state.selection

              editor
                .chain()
                .focus()
                .insertContentAt(
                  {
                    from: selection.from,
                    to: selection.to,
                  },
                  completion,
                )
                .run()
            }
          }}
        >
          <Check />
          Replace selection
        </CommandItem>
        <CommandItem
          className="gap-2 px-4"
          value="insert"
          onSelect={() => {
            if (editor) {
              const selection = editor.view.state.selection
              editor
                .chain()
                .focus()
                .insertContentAt(selection.to + 1, completion)
                .run()
            }
          }}
        >
          <QuoteIcon />
          Insert below
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />

      <CommandGroup>
        <CommandItem onSelect={onDiscard} value="thrash" className="gap-2 px-4">
          <TrashIcon />
          Discard
        </CommandItem>
      </CommandGroup>
    </>
  )
}

export default AICompletionCommands

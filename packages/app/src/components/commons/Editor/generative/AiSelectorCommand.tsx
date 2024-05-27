import {
  ArrowDownward as ArrowDownwardIcon,
  Check as CheckIcon,
  Refresh as RefreshIcon,
  Forward as ForwardIcon,
  WrapText as WrapTextIcon,
} from "@mui/icons-material"
import { useEditor } from "novel"
import { getPrevText } from "novel/extensions"
import { CommandGroup, CommandItem, CommandSeparator } from "./Command"

const options = [
  {
    value: "improve",
    label: "Improve writing",
    icon: RefreshIcon,
  },

  {
    value: "fix",
    label: "Fix grammar",
    icon: CheckIcon,
  },
  {
    value: "shorter",
    label: "Make shorter",
    icon: ArrowDownwardIcon,
  },
  {
    value: "longer",
    label: "Make longer",
    icon: WrapTextIcon,
  },
]

interface AISelectorCommandsProps {
  onSelect: (value: any, option: any) => void
}

const AISelectorCommands = ({ onSelect }: AISelectorCommandsProps) => {
  const { editor } = useEditor()

  return (
    <>
      <CommandGroup>
        {options.map((option) => (
          <CommandItem
            onSelect={(value) => {
              if (editor) {
                const slice = editor.state.selection.content()
                const text = editor.storage.markdown.serializer.serialize(slice.content)
                onSelect(text, value)
              }
            }}
            className="flex gap-2 px-4"
            key={option.value}
            value={option.value}
          >
            <option.icon className="h-4 w-4 text-purple-500" />
            {option.label}
          </CommandItem>
        ))}
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup>
        <CommandItem
          onSelect={() => {
            if (editor) {
              const text = getPrevText(editor, { chars: 5000 })
              onSelect(text, "continue")
            }
          }}
          value="continue"
          className="gap-2 px-4"
        >
          <ForwardIcon className="h-4 w-4 text-purple-500" />
          Continue writing
        </CommandItem>
      </CommandGroup>
    </>
  )
}

export default AISelectorCommands

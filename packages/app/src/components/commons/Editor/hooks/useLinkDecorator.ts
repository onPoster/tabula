import { ContentBlock, ContentState } from "draft-js"
import EditorLink from "../EditorComponents/EditorLink"

const useLinkDecorator = () => {
  return [
    {
      strategy: findLinkEntities,
      component: EditorLink,
    },
  ]
}

function findLinkEntities(
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState,
) {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity()
    return entityKey !== null && contentState.getEntity(entityKey).getType() === "LINK"
  }, callback)
}

export default useLinkDecorator

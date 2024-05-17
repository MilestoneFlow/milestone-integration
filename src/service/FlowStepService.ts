import { FlowStep, FlowStepBlock, FlowStepBlockType } from '../types/flowTypes'

export const getStepText = (step: FlowStep): string | null => {
  const stepTextBlock = step.data.blocks.filter((block) => block.type === 'text')[0]

  if (!stepTextBlock) {
    return null
  }

  return stepTextBlock.data
}

export const updateBlockText = (blocks: FlowStepBlock[], newText: string): FlowStepBlock[] => {
  const stepTextBlock = blocks.filter((block) => block.type === FlowStepBlockType.Text)[0]
  if (!stepTextBlock) {
    blocks.push({
      blockId: `block_${Date.now()}`,
      type: FlowStepBlockType.Text,
      order: blocks.length + 1,
      data: newText,
    })

    return blocks
  }

  stepTextBlock.data = newText
  for (let i = 0; i < blocks.length; ++i) {
    if (blocks[i].blockId === stepTextBlock.blockId) {
      blocks[i] = stepTextBlock
      break
    }
  }

  return blocks
}

export const updateStepBlockVideo = (blocks: FlowStepBlock[], data: string): FlowStepBlock[] => {
  for (let i = 0; i < blocks.length; ++i) {
    if (blocks[i].type === FlowStepBlockType.Video) {
      blocks[i].data = data
      return blocks
    }
  }

  const updatedBlock: FlowStepBlock = {
    blockId: `block_${Date.now()}`,
    data: data,
    order: 1,
    type: FlowStepBlockType.Video,
  }
  blocks = [
    updatedBlock,
    ...blocks.map((block: FlowStepBlock, i: number) => ({
      ...block,
      order: i + 2,
    })),
  ]

  return blocks
}

export const updateStepBlockMedia = (
  blocks: FlowStepBlock[],
  type: FlowStepBlockType,
  data: string,
): FlowStepBlock[] => {
  for (let i = 0; i < blocks.length; ++i) {
    if (
      [FlowStepBlockType.Video, FlowStepBlockType.Gif, FlowStepBlockType.Image].includes(
        blocks[i].type,
      )
    ) {
      blocks[i].data = data
      blocks[i].type = type
      return blocks
    }
  }

  const updatedBlock: FlowStepBlock = {
    blockId: `block_${Date.now()}`,
    data: data,
    order: 1,
    type: type,
  }
  blocks = [
    updatedBlock,
    ...blocks.map((block: FlowStepBlock, i: number) => ({
      ...block,
      order: i + 2,
    })),
  ]

  return blocks
}

export const getTextBlockContent = (blocks: FlowStepBlock[]): string | null => {
  const stepTextBlock = blocks.filter((block) => block.type === 'text')[0]

  if (!stepTextBlock) {
    return null
  }

  return stepTextBlock.data
}

export const getVideoBlockContent = (blocks: FlowStepBlock[]): string | null => {
  const videoBlock = blocks.filter((block) => block.type === FlowStepBlockType.Video)[0]

  if (!videoBlock) {
    return null
  }

  return videoBlock.data
}

export const getMediaBlock = (blocks: FlowStepBlock[]): FlowStepBlock | null => {
  for (const block of blocks) {
    if (isMediaBlock(block)) {
      return block
    }
  }

  return null
}

export const isMediaBlock = (block: FlowStepBlock): boolean => {
  return [FlowStepBlockType.Gif, FlowStepBlockType.Image, FlowStepBlockType.Video].includes(
    block.type,
  )
}

export const removeMediaBlocks = (blocks: FlowStepBlock[]): FlowStepBlock[] => {
  return blocks.filter((block) => !isMediaBlock(block))
}

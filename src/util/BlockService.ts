import { Block, BlockType } from "../types/element";

export const updateBlockText = (blocks: Block[], newText: string): Block[] => {
  const stepTextBlock = blocks.filter(
    (block) => block.type === BlockType.Text,
  )[0];
  if (!stepTextBlock) {
    blocks.push({
      blockId: `block_${Date.now()}`,
      type: BlockType.Text,
      order: blocks.length + 1,
      data: newText,
    });

    return blocks;
  }

  stepTextBlock.data = newText;
  for (let i = 0; i < blocks.length; ++i) {
    if (blocks[i].blockId === stepTextBlock.blockId) {
      blocks[i] = stepTextBlock;
      break;
    }
  }

  return blocks;
};

export const updateStepBlockVideo = (
  blocks: Block[],
  data: string,
): Block[] => {
  for (let i = 0; i < blocks.length; ++i) {
    if (blocks[i].type === BlockType.Video) {
      blocks[i].data = data;
      return blocks;
    }
  }

  const updatedBlock: Block = {
    blockId: `block_${Date.now()}`,
    data: data,
    order: 1,
    type: BlockType.Video,
  };
  blocks = [
    updatedBlock,
    ...blocks.map((block: Block, i: number) => ({
      ...block,
      order: i + 2,
    })),
  ];

  return blocks;
};

export const updateStepBlockMedia = (
  blocks: Block[],
  type: BlockType,
  data: string,
): Block[] => {
  for (let i = 0; i < blocks.length; ++i) {
    if (
      [BlockType.Video, BlockType.Gif, BlockType.Image].includes(blocks[i].type)
    ) {
      blocks[i].data = data;
      blocks[i].type = type;
      return blocks;
    }
  }

  const updatedBlock: Block = {
    blockId: `block_${Date.now()}`,
    data: data,
    order: 1,
    type: type,
  };
  blocks = [
    updatedBlock,
    ...blocks.map((block: Block, i: number) => ({
      ...block,
      order: i + 2,
    })),
  ];

  return blocks;
};

export const getTextBlockContent = (blocks: Block[]): string | null => {
  const stepTextBlock = blocks.filter((block) => block.type === "text")[0];

  if (!stepTextBlock) {
    return null;
  }

  return stepTextBlock.data;
};

export const getVideoBlockContent = (blocks: Block[]): string | null => {
  const videoBlock = blocks.filter(
    (block) => block.type === BlockType.Video,
  )[0];

  if (!videoBlock) {
    return null;
  }

  return videoBlock.data;
};

export const getMediaBlock = (blocks: Block[]): Block | null => {
  for (const block of blocks) {
    if (isMediaBlock(block)) {
      return block;
    }
  }

  return null;
};

export const isMediaBlock = (block: Block): boolean => {
  return [BlockType.Gif, BlockType.Image, BlockType.Video].includes(block.type);
};

export const removeMediaBlocks = (blocks: Block[]): Block[] => {
  return blocks.filter((block) => !isMediaBlock(block));
};

export enum BlockType {
  Text = "text",
  Image = "image",
  Video = "video",
  Gif = "gif",
}

export enum Placement {
  Top = "top",
  Bottom = "bottom",
  Left = "left",
  Right = "right",
}

export enum ElementType {
  Tooltip = "tooltip",
  Helper = "helper",
}

export interface Block {
  blockId: string;
  type: BlockType;
  data: string;
  order: number;
}

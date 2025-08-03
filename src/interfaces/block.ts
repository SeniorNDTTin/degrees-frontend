export interface IGetBlocksQuantity {
  quantity: number;
}

export interface IBlock {
  _id: string;
  index: number;
  previousHash: string;
  currentHash: string;
  data: {
    collection: string;
    collectionId: string;
    userId: string;
    userName?: string;
    _id: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IFindBlocks {
  blocks: {
    total: number;
    page: number;
    limit: number;
    items: IBlock[];
  };
}

export interface ICheckBlocks {
  success: boolean;
}
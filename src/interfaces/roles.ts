export interface IRole {
  _id: string;
  name: string;
  description: string;
  permissions: string[];
  createdBy: {
    userId: string;
    createdAt: Date;
    _id: string;
  };
  isDeleted: boolean;
  updatedBy: { userId: string; updatedAt: Date }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IFindRoles {
  roles: {
    total: number;
    page: number;
    limit: number;
    items: IRole[];
  };
}

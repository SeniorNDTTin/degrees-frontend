export interface IRole {
  _id: string;
  name: string;
  description: string;
  permissions: string[];
  createdBy: {
    userId: string;
    createdAt: string;
    _id: string;
  };
  isDeleted: boolean;
  updatedBy: {
    userId: string;
    updatedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IFindRoles {
  roles: {
    total: number;
    items: IRole[];
  };
}

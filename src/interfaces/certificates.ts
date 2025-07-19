export interface ICertificate {
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

export interface ICreateCertificate {
certificate: {
    total: number;
    page: number;
    limit: number;
    items: ICertificate[];
  };
}
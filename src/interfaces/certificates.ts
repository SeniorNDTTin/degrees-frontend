export interface ICertificate {
  _id: string;
  title: string;
  score: number;
  scoreDetails?: string;
  issuedDate: string;
  certHash: string;
  blockchainTxID: string;
  status: string;
  studentEmail: string;
  issuerID: string;
  studentSignature: string;
  issuerSignature: string;
  createdBy: {
    userId: string;
    createdAt: string;
  };
  updatedBy?: {
    userId: string;
    updatedAt: string;
  }[];
  isDeleted?: boolean;
  deletedBy?: {
    userId: string;
    deletedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IFindCertificates {
  certificates: {
    total: number;
    page: number;
    limit: number;
    items: ICertificate[];
  };
}
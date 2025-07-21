export interface IDegree {
  _id: string;
  degreeName: string;
  major: string;
  GPA: number;
  classification: string;
  issuedDate: string;
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
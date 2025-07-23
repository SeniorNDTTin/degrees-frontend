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
  createdBy: { userId: string; createdAt: string };
  updatedBy?: { userId: string; updatedAt: string }[];
  isDeleted?: boolean;
  deletedBy?: { userId: string; deletedAt: string };
}

export interface IFindDegrees {
  degrees: {
    total: number;
    page: number;
    limit: number;
    items: IDegree[];
  };
}

export interface IResponse<T> {
  data: T;
}
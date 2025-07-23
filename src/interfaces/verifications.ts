export interface IVerification {
  _id: string;
  type: 'degree' | 'certificate';
  verifierId: string;
  degreeId?: string;
  certificateId?: string;
  description: string;
  status: boolean;
  studentEmail: string;
  createdBy?: {
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
} 
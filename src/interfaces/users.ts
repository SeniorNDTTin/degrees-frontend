export interface IUser {
  _id: string;
  email: string;
  fullName: string;
  gender: 'male' | 'female' | 'other';
  phoneNumber: string;
  roleId: string;
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
  deletedBy?: {
    userId: string;
    deletedAt: string;
  };
} 
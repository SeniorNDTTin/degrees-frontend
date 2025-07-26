export enum EUserGender {
  MALE = 'male',
  FEMALE = 'female',
}

export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  birthday: string;
  gender: EUserGender;
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
  deletedBy?: {
    userId: string;
    deletedAt: string;
  };
} 
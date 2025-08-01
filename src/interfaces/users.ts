export enum EUserGender {
  MALE = 'male',
  FEMALE = 'female',
}

export interface ICreateUserRequest {
  fullName: string; // IsString, IsNotEmpty
  email: string; // IsEmail, IsString, IsNotEmpty
  password: string; // IsStrongPassword (min 8, lowercase, uppercase, symbol, number)
  birthday: Date; // IsDate
  gender: EUserGender; // IsIn(['male', 'female'])
  roleId: string; // IsString
}

export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  birthday: string;
  gender: EUserGender;
  roleId?: string;
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
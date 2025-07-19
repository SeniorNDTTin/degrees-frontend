export interface ILogin {
  userId: string;
}

export interface ILoginValidateOTP {
  access_token: string;
}

export interface ICheckAccessToken {
  success: true;
}

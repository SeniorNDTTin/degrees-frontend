import axios from "axios";

import type { ICheckAccessToken, ILogin, ILoginValidateOTP } from "../interfaces/auth";
import { backendDomainV1 } from "../constants/common";
import type { IResponse } from "../interfaces/response";

export const loginApi = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  return await axios.post<IResponse<ILogin>>(`${backendDomainV1}/auth/login`, {
    email,
    password,
  });
};

export const loginValidateOTPApi = async ({
  userId,
  otp,
}: {
  userId: string;
  otp: string;
}) => {
  return await axios.post<IResponse<ILoginValidateOTP>>(`${backendDomainV1}/auth/login/validate-otp`, {
    userId,
    otp,
  });
};

export const checkAccessToken = async ({
  accessToken,
}: {
  accessToken: string;
}) => {
  return await axios.get<IResponse<ICheckAccessToken>>(
    `${backendDomainV1}/auth/check-access-token`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
};

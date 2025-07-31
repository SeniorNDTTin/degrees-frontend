import axios from "axios";

import { backendDomainV1 } from "../constants/common";
import type { IResponse } from "../interfaces/response";
import type { IUser } from "../interfaces/users";

interface IFindUsersResponse {
  users: {
    total: number;
    page: number;
    limit: number;
    items: IUser[];
  };
}

export const findUsersApi = async ({ 
  accessToken,
  page = 1,
  limit = 10
}: { 
  accessToken: string;
  page?: number;
  limit?: number;
}) => {
  return axios.get<IResponse<IFindUsersResponse>>(`${backendDomainV1}/users/find`, {
    params: {
      page,
      limit
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const findUserByIdApi = async ({
  accessToken,
  id,
}: {
  accessToken: string;
  id: string;
}) => {
  return axios.get<IResponse<IUser>>(`${backendDomainV1}/users/find/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const createUserApi = async ({
  accessToken,
  ...data
}: {
  accessToken: string;
} & ICreateUserRequest) => {
  return await axios.post<IResponse<IUser>>(
    `${backendDomainV1}/users/create`,
    {
      ...data,
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password.trim(),
      roleId: data.roleId.trim()
    },
    {
      headers: { Authorization: `Bearer ${accessToken}` }
    }
  );
};

export const updateUserApi = async ({
  accessToken,
  id,
  fullName,
  email,
  gender,
  birthday,
  roleId,
}: {
  accessToken: string;
  id: string;
  fullName?: string;
  email?: string;
  gender?: "male" | "female";
  birthday?: string;
  roleId?: string;
}) => {
  const requestData = {
    fullName,
    email,
    gender,
    birthday,
    roleId,
  };
  console.log('Update user request:', requestData);

  const response = await axios.patch<IResponse<IUser>>(
    `${backendDomainV1}/users/update/${id}`,
    requestData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  console.log('Update user response:', response.data);
  return response;
};

export const deleteUserApi = async ({
  accessToken,
  id,
}: {
  accessToken: string;
  id: string;
}) => {
  return axios.delete<IResponse<IUser>>(`${backendDomainV1}/users/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}; 
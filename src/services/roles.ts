import axios from "axios";

import { backendDomainV1 } from "../constants/common";
import type { IFindRoles, IRole } from "../interfaces/roles";
import type { IResponse } from "../interfaces/response";

export const findRolesApi = async ({
  accessToken,
  filter,
  page,
  limit,
}: {
  accessToken: string;
  filter?: Record<string, any>;
  page?: number;
  limit?: number;
}) => {
  console.log('Fetching roles...');
  const response = await axios.get<IResponse<IFindRoles>>(
    `${backendDomainV1}/roles/find`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  console.log('Roles response:', response.data);
  return response;
};

export const findRoleByIdApi = async ({
  accessToken,
  id,
}: {
  accessToken: string;
  id: string;
}) => {
  return await axios.get<IResponse<IRole>>(
    `${backendDomainV1}/roles/find/${id}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
};

export const deleteRoleApi = async ({
  accessToken,
  id,
}: {
  accessToken: string;
  id: string;
}) => {
  return await axios.delete(`${backendDomainV1}/roles/delete/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};

export const createRoleApi = async ({
  accessToken,
  name,
  description,
  permissions,
}: {
  accessToken: string;
  name: string;
  description: string;
  permissions: string[];
}) => {
  return await axios.post(
    `${backendDomainV1}/roles/create`,
    {
      name,
      description,
      permissions,
    },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
};

export const updateRoleApi = async ({
  accessToken,
  id,
  name,
  description,
  permissions,
}: {
  accessToken: string;
  id: string;
  name: string;
  description: string;
  permissions: string[];
}) => {
  return await axios.patch(
    `${backendDomainV1}/roles/update/${id}`,
    {
      name,
      description,
      permissions,
    },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
};

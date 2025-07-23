import axios from "axios";
import { backendDomainV1 } from "../constants/common";
import type { IDegree } from "../interfaces/degrees";

interface IFindDegreesApiProps {
  accessToken: string;
  filter?: Record<string, any>;
  page?: number;
  limit?: number;
}

interface IDegreesResponse {
  degrees: {
    items: IDegree[];
    total: number;
    page: number;
    limit: number;
  };
}

export const findDegreesApi = async ({
  accessToken,
  filter,
  page,
  limit,
}: IFindDegreesApiProps) => {
  return await axios.get<{ data: IDegreesResponse }>(`${backendDomainV1}/degrees/find`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      filter: filter ? JSON.stringify(filter) : undefined,
      page,
      limit,
    },
  });
};

export const findDegreeByIdApi = async ({
  accessToken,
  id,
}: {
  accessToken: string;
  id: string;
}) => {
  return await axios.get<{ data: IDegree }>(`${backendDomainV1}/degrees/find/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}; 
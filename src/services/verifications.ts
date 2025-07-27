import axios from "axios";
import { backendDomainV1 } from "../constants/common";
import type { IVerification } from "../interfaces/verifications";

interface IFindVerificationsApiProps {
  accessToken: string;
  filter?: Record<string, any>;
  page?: number;
  limit?: number;
}

interface ICreateVerificationApiProps {
  accessToken: string;
  type: 'degree' | 'certificate';
  verifierId: string;
  degreeId?: string;
  certificateId?: string;
  description: string;
  studentEmail: string;
}

interface IUpdateVerificationApiProps extends ICreateVerificationApiProps {
  id: string;
}

interface IDeleteVerificationApiProps {
  accessToken: string;
  id: string;
}

interface IVerificationsPagination {
  items: IVerification[];
  total: number;
  page: number;
  limit: number;
}

interface IVerificationsResponse {
  verifications: IVerificationsPagination;
}

export const findVerificationsApi = async ({
  accessToken,
  filter,
  page,
  limit,
}: IFindVerificationsApiProps) => {
  return await axios.get<{ data: IVerificationsResponse }>(`${backendDomainV1}/verifications/find`, {
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

export const findVerificationByIdApi = async ({
  accessToken,
  id,
}: {
  accessToken: string;
  id: string;
}) => {
  return await axios.get<{ data: IVerification }>(`${backendDomainV1}/verifications/find/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const createVerificationApi = async ({
  accessToken,
  ...data
}: ICreateVerificationApiProps) => {
  return await axios.post(`${backendDomainV1}/verifications/create`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const updateVerificationApi = async ({
  accessToken,
  id,
  ...data
}: IUpdateVerificationApiProps) => {
  return await axios.patch(`${backendDomainV1}/verifications/update/${id}`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const deleteVerificationApi = async ({
  accessToken,
  id,
}: IDeleteVerificationApiProps) => {
  return await axios.delete(`${backendDomainV1}/verifications/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}; 
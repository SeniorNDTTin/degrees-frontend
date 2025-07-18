import axios from "axios";
import { backendDomainV1 } from "../constants/common";

interface IFindVerifiersApiProps {
  accessToken: string;
  filter?: Record<string, any>;
  page?: number;
  limit?: number;
}

interface ICreateVerifierApiProps {
  accessToken: string;
  verifierName: string;
  organization: string;
  verifierEmail: string;
}

interface IUpdateVerifierApiProps {
  accessToken: string;
  id: string;
  verifierName?: string;
  organization?: string;
  verifierEmail?: string;
}

interface IDeleteVerifierApiProps {
  accessToken: string;
  id: string;
}

export const findVerifiersApi = async ({
  accessToken,
  filter,
  page,
  limit,
}: IFindVerifiersApiProps) => {
  return await axios.get(`${backendDomainV1}/verifiers/find`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      filter,
      page,
      limit,
    },
  });
};

export const findVerifierByIdApi = async ({
  accessToken,
  id,
}: {
  accessToken: string;
  id: string;
}) => {
  return await axios.get(`${backendDomainV1}/verifiers/find/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const createVerifierApi = async ({
  accessToken,
  verifierName,
  organization,
  verifierEmail,
}: ICreateVerifierApiProps) => {
  return await axios.post(
    `${backendDomainV1}/verifiers/create`,
    {
      verifierName,
      organization,
      verifierEmail,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

export const updateVerifierApi = async ({
  accessToken,
  id,
  verifierName,
  organization,
  verifierEmail,
}: IUpdateVerifierApiProps) => {
  return await axios.patch(
    `${backendDomainV1}/verifiers/update/${id}`,
    {
      verifierName,
      organization,
      verifierEmail,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

export const deleteVerifierApi = async ({
  accessToken,
  id,
}: IDeleteVerifierApiProps) => {
  return await axios.delete(`${backendDomainV1}/verifiers/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}; 
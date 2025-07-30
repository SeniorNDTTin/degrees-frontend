import axios from "axios";

import { backendDomainV1 } from "../constants/common";
import type { IResponse } from "../interfaces/response";
import type { IDegree, IFindDegrees } from "../interfaces/degrees";

export const findDegreesApi = async ({
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
  return await axios.get<IResponse<IFindDegrees>>(
    `${backendDomainV1}/degrees/find`,
    {
      params: { filter: JSON.stringify(filter), page, limit },
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
};

export const findDegreeByIdApi = async ({
  accessToken,
  id,
}: {
  accessToken: string;
  id: string;
}) => {
  return await axios.get<IResponse<IDegree>>(
    `${backendDomainV1}/degrees/find/${id}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
};

export const deleteDegreeApi = async ({
  accessToken,
  id,
}: {
  accessToken: string;
  id: string;
}) => {
  return await axios.delete(`${backendDomainV1}/degrees/delete/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};

export const createDegreeApi = async ({
  accessToken,
  degreeName,
  major,
  GPA,
  classification,
  issuedDate,
  studentEmail,
  issuerID,
}: {
  accessToken: string;
  degreeName: string;
  major: string;
  GPA: number;
  classification: string;
  issuedDate: string;
  studentEmail: string;
  issuerID: string;
}) => {
  return await axios.post(
    `${backendDomainV1}/degrees/create`,
    {
      degreeName,
      major,
      GPA,
      classification,
      issuedDate,
      studentEmail,
      issuerID,
    },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
};

export const updateDegreeApi = async ({
  accessToken,
  id,
  degreeName,
  major,
  GPA,
  classification,
  issuedDate,
  studentEmail,
  issuerID,
}: {
  accessToken: string;
  id: string;
  degreeName?: string;
  major?: string;
  GPA?: number;
  classification?: string;
  issuedDate?: string;
  studentEmail?: string;
  issuerID?: string;
}) => {
  return await axios.patch(
    `${backendDomainV1}/degrees/update/${id}`,
    {
      degreeName,
      major,
      GPA,
      classification,
      issuedDate,
      studentEmail,
      issuerID,
    },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
};

export const findDegreeByDegreeHash = async ({
  accessToken,
  degreeHash,
}: {
  accessToken: string;
  degreeHash: string;
}) => {
  return await axios.get<IResponse<IDegree>>(
    `${backendDomainV1}/degrees/find/by/degree-hash/${degreeHash}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
};

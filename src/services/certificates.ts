import axios from "axios";

import { backendDomainV1 } from "../constants/common";
import type {
  ICertificate,
  IFindCertificates,
} from "../interfaces/certificates";
import type { IResponse } from "../interfaces/response";

export const findCertificatesApi = async ({
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
  return await axios.get<IResponse<IFindCertificates>>(
    `${backendDomainV1}/certificates/find`,
    {
      params: { filter: JSON.stringify(filter), page, limit },
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
};

export const findCertificateByIdApi = async ({
  accessToken,
  id,
}: {
  accessToken: string;
  id: string;
}) => {
  return await axios.get<IResponse<ICertificate>>(
    `${backendDomainV1}/certificates/find/${id}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
};

export const deleteCertificateApi = async ({
  accessToken,
  id,
}: {
  accessToken: string;
  id: string;
}) => {
  return await axios.delete(`${backendDomainV1}/certificates/delete/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};

export const createCertificateApi = async ({
  accessToken,
  title,
  score,
  scoreDetails,
  issuedDate,
  studentEmail,
  issuerID,
}: {
  accessToken: string;
  title: string;
  score: number;
  scoreDetails?: string;
  issuedDate: string;
  studentEmail: string;
  issuerID: string;
}) => {
  return await axios.post(
    `${backendDomainV1}/certificates/create`,
    {
      title,
      score,
      scoreDetails,
      issuedDate,
      studentEmail,
      issuerID,
    },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
};

export const updateCertificateApi = async ({
  accessToken,
  id,
  title,
  score,
  scoreDetails,
  issuedDate,
  studentEmail,
  issuerID,
}: {
  accessToken: string;
  id: string;
  title?: string;
  score?: number;
  scoreDetails?: string;
  issuedDate?: string;
  studentEmail?: string;
  issuerID?: string;
}) => {
  return await axios.patch(
    `${backendDomainV1}/certificates/update/${id}`,
    {
      title,
      score,
      scoreDetails,
      issuedDate,
      studentEmail,
      issuerID,
    },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
};

export const findCertificateByCertificateHash = async ({
  accessToken,
  certificateHash,
}: {
  accessToken: string;
  certificateHash: string;
}) => {
  return await axios.get<IResponse<ICertificate>>(
    `${backendDomainV1}/certificates/find/by/certificate-hash/${certificateHash}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
};

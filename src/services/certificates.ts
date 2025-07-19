import axios from "axios";

import { backendDomainV1 } from "../constants/common";
import type { ICertificate, IFindCertificates } from "../interfaces/certificates";
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
  certHash,
  blockchainTxID,
  status,
  studentEmail,
  issuerID,
  studentSignature,
  issuerSignature,
}: {
  accessToken: string;
  title: string;
  score: number;
  scoreDetails?: string;
  issuedDate: string;
  certHash: string;
  blockchainTxID: string;
  status: string;
  studentEmail: string;
  issuerID: string;
  studentSignature: string;
  issuerSignature: string;
}) => {
  return await axios.post(
    `${backendDomainV1}/certificates/create`,
    {
      title,
      score,
      scoreDetails,
      issuedDate,
      certHash,
      blockchainTxID,
      status,
      studentEmail,
      issuerID,
      studentSignature,
      issuerSignature,
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
  certHash,
  blockchainTxID,
  status,
  studentEmail,
  issuerID,
  studentSignature,
  issuerSignature,
}: {
  accessToken: string;
  id: string;
  title?: string;
  score?: number;
  scoreDetails?: string;
  issuedDate?: string;
  certHash?: string;
  blockchainTxID?: string;
  status?: string;
  studentEmail?: string;
  issuerID?: string;
  issuerType?: string;
  studentSignature?: string;
  issuerSignature?: string;
}) => {
  return await axios.patch(
    `${backendDomainV1}/certificates/update/${id}`,
    {
      title,
      score,
      scoreDetails,
      issuedDate,
      certHash,
      blockchainTxID,
      status,
      studentEmail,
      issuerID,
      studentSignature,
      issuerSignature,
    },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
};
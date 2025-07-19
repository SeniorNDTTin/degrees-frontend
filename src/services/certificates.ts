import axios from "axios";

import { backendDomainV1 } from "../constants/common"; 
import type { ICertificate, ICreateCertificate } from "../interfaces/certificates";
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
    return await axios.post<IResponse<ICertificate>>(
        `${backendDomainV1}/certificates/create`,
        {
            hearders: { Authorization: `Bearer ${accessToken}` },
        },
    );
};

export const findCertificateByIdApi = async ({
    accessToken,
    id,
}: {
    accessToken: string;
    id?: string;
}) => {
    return await axios.get<IResponse<ICreateCertificate>>(
        `${backendDomainV1}/certificates/find/${id ? id : ""}`,
        {
            headers: { Authorization: `Bearer ${accessToken}` },
        }
    );
}

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
}

expo


import axios from "axios";
import { backendDomainV1 } from "../constants/common";
import type {
  ICreateIssuingAgencyDto,
  IFindIssuingAgenciesDto,
  IUpdateIssuingAgencyDto,
  IIssuingAgencyResponse,
  IIssuingAgencyData,
  IIssuingAgenciesData
} from "../interfaces/issuing-agencies";

export const createIssuingAgency = async ({
  accessToken,
  ...data
}: ICreateIssuingAgencyDto & { accessToken: string }) => {
  return await axios.post<IIssuingAgencyData>(
    `${backendDomainV1}/issuing-agencies/create`,
    data,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
};

export const getIssuingAgencies = async ({
  accessToken,
  page,
  limit,
  searchKey
}: IFindIssuingAgenciesDto & { accessToken: string }) => {
  const filter = searchKey ? { name: searchKey } : {};
  
  return await axios.get<IIssuingAgenciesData>(
    `${backendDomainV1}/issuing-agencies/find`,
    {
      params: { 
        filter: JSON.stringify(filter),
        page: page || 1,
        limit: limit || 10
      },
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
};

export const getIssuingAgencyById = async ({
  accessToken,
  id
}: {
  accessToken: string;
  id: string;
}) => {
  return await axios.get<IIssuingAgencyData>(
    `${backendDomainV1}/issuing-agencies/find/${id}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
};

export const updateIssuingAgency = async ({
  accessToken,
  id,
  ...data
}: IUpdateIssuingAgencyDto & {
  accessToken: string;
  id: string;
}) => {
  return await axios.patch<IIssuingAgencyData>(
    `${backendDomainV1}/issuing-agencies/update/${id}`,
    data,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
};

export const deleteIssuingAgency = async ({
  accessToken,
  id
}: {
  accessToken: string;
  id: string;
}) => {
  return await axios.delete<IIssuingAgencyData>(
    `${backendDomainV1}/issuing-agencies/delete/${id}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
}; 
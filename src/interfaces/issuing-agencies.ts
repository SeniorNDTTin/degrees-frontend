interface IIssuingAgency {
  _id?: string;
  name: string;
  email: string;
  location: string;
  publicKey?: string;
  isUniversity: boolean;
  createdBy?: { userId: string; createdAt: Date };
  updatedBy?: { userId: string; updatedAt: Date }[];
  isDeleted?: boolean;
  deletedBy?: { userId: string; deletedAt: Date };
  createdAt?: string;
  updatedAt?: string;
}

interface ICreateIssuingAgencyDto {
  name: string;
  email: string;
  location: string;
  isUniversity: boolean;
}

interface IUpdateIssuingAgencyDto {
  name?: string;
  email?: string;
  location?: string;
  isUniversity?: boolean;
}

interface IFindIssuingAgenciesDto {
  page?: number;
  limit?: number;
  searchKey?: string;
}

interface IIssuingAgencyResponse {
  _id: string;
  name: string;
  email: string;
  location: string;
  publicKey?: string;
  isUniversity: boolean;
  createdBy: { userId: string; createdAt: string };
  updatedBy?: { userId: string; updatedAt: string }[];
  isDeleted: boolean;
  deletedBy?: { userId: string; deletedAt: string };
  createdAt: string;
  updatedAt: string;
}

interface IBaseResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

interface IIssuingAgencyData extends IBaseResponse<IIssuingAgencyResponse> {}

interface IIssuingAgenciesPagination {
  items: IIssuingAgencyResponse[];
  total: number;
  page: number;
  limit: number;
}

interface IIssuingAgenciesData extends IBaseResponse<{
  issuingAgencies: IIssuingAgenciesPagination;
}> {}

export type {
  IIssuingAgency,
  ICreateIssuingAgencyDto,
  IUpdateIssuingAgencyDto,
  IFindIssuingAgenciesDto,
  IIssuingAgencyResponse,
  IIssuingAgencyData,
  IIssuingAgenciesData
}; 
import axios from "axios";

import { backendDomainV1 } from "../constants/common";
import type { IResponse } from "../interfaces/response";
import type {
  ICheckBlocks,
  IFindBlocks,
  IGetBlocksQuantity,
} from "../interfaces/block";

export const getBlocksQuantityApi = async ({
  accessToken,
  collection,
  collectionId,
}: {
  accessToken: string;
  collection: string;
  collectionId: string;
}) => {
  return await axios.get<IResponse<IGetBlocksQuantity>>(
    `${backendDomainV1}/blocks/get-blocks-quantity/${collection}/${collectionId}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
};

export const findBlocksApi = async ({
  accessToken,
  collection,
  collectionId,
}: {
  accessToken: string;
  collection: string;
  collectionId: string;
}) => {
  return await axios.get<IResponse<IFindBlocks>>(
    `${backendDomainV1}/blocks/find?filter={"collection": "${collection}", "collectionId": "${collectionId}"}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
};

export const checkBlocks = async ({
  accessToken,
  collection,
  collectionId,
}: {
  accessToken: string;
  collection: string;
  collectionId: string;
}) => {
  return await axios.get<IResponse<ICheckBlocks>>(
    `${backendDomainV1}/blocks/check-blocks/${collection}/${collectionId}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
};

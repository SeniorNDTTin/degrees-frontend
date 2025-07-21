import axios from "axios";
import { backendDomainV1 } from "../constants/common";
import type { IUser } from "../interfaces/users";

interface IFindUserByIdApiProps {
  accessToken: string;
  id: string;
}

export const findUserByIdApi = async ({
  accessToken,
  id,
}: IFindUserByIdApiProps) => {
  return await axios.get<{ data: IUser }>(`${backendDomainV1}/users/find/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}; 
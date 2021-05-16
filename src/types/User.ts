import { GetUserResponse } from './schemas/getUser/Response';

type IUser = Required<GetUserResponse> & {
  lastTokenReset: number;
  password: string;
};

export default IUser;

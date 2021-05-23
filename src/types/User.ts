import { Except } from 'type-fest';
import { GetUserResponse } from './schemas/getUser/Response';

type IUser = Except<Required<GetUserResponse>, 'id'> & {
  id?: string;
  lastTokenReset?: number;
  password?: string;
};

export default IUser;

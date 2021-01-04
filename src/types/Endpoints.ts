import { CreateAccountQuery } from './schemas/createAccount/Query';
import { CreateAccountResponse } from './schemas/createAccount/Response';
import { SignInQuery } from './schemas/signIn/Query';
import { SignInResponse } from './schemas/signIn/Response';

export type EndpointResponse<T> = {
  data?: T;
};

export type Endpoints = {
  createAccount: {
    query: CreateAccountQuery;
    response: CreateAccountResponse;
  };
  signIn: {
    query: SignInQuery;
    response: SignInResponse;
  };
};

export type Query<T extends keyof Endpoints> = Endpoints[T]['query'];
export type Response<T extends keyof Endpoints> = EndpointResponse<Endpoints[T]['response']>;

export type EndpointProvider = {
  [method in keyof Endpoints]: (params: Query<method>) => Promise<Response<method>>;
};

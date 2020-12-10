import { CreateAccountQuery } from './schemas/createAccount/Query';
import { CreateAccountResponse } from './schemas/createAccount/Response';
import { GetPostQuery } from './schemas/getPost/Query';
import { GetPostResponse } from './schemas/getPost/Response';

export type Endpoints = {
  GET: {
    getPost: {
      query: GetPostQuery;
      response: GetPostResponse;
    };
  };
  POST: {
    createAccount: {
      query: CreateAccountQuery;
      response: CreateAccountResponse;
    };
  };
};

export type EndpointProvider = {
  [method in keyof Endpoints['GET']]: (
    params: Endpoints['GET'][method]['query'],
  ) => Promise<Endpoints['GET'][method]['response']>;
} & {
  [method in keyof Endpoints['POST']]: (
    params: Endpoints['POST'][method]['query'],
  ) => Promise<Endpoints['POST'][method]['response']>;
};

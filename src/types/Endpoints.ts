import { CreateAccountQuery } from './schemas/createAccount/Query';
import { CreateAccountResponse } from './schemas/createAccount/Response';
import { CreatePostQuery } from './schemas/createPost/Query';
import { CreatePostResponse } from './schemas/createPost/Response';
import { SignInQuery } from './schemas/signIn/Query';
import { SignInResponse } from './schemas/signIn/Response';

export type Endpoints = {
  createAccount: {
    query: CreateAccountQuery;
    response: CreateAccountResponse;
  };
  createPost: {
    query: CreatePostQuery;
    response: CreatePostResponse;
  };
  signIn: {
    query: SignInQuery;
    response: SignInResponse;
  };
};

export type Query<T extends keyof Endpoints> = Endpoints[T]['query'];
export type Response<T extends keyof Endpoints> = Endpoints[T]['response'];

export type EndpointProvider = {
  [method in keyof Endpoints]: (params: Query<method>) => Promise<Response<method>>;
};

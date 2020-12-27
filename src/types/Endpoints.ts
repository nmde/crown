import { CreateAccountQuery } from './schemas/createAccount/Query';
import { CreateAccountResponse } from './schemas/createAccount/Response';
import { CreatePostQuery } from './schemas/createPost/Query';
import { CreatePostResponse } from './schemas/createPost/Response';
import { GetPostQuery } from './schemas/getPost/Query';
import { GetPostResponse } from './schemas/getPost/Response';
import { SignInQuery } from './schemas/signIn/Query';
import { SignInResponse } from './schemas/signIn/Response';

export type EndpointResponse<T> = {
  data: T;
  error?: string;
};

export type Endpoints = {
  GET: {
    getPost: {
      query: GetPostQuery;
      response: EndpointResponse<GetPostResponse>;
    };
  };
  POST: {
    createAccount: {
      query: CreateAccountQuery;
      response: EndpointResponse<CreateAccountResponse>;
    };
    createPost: {
      query: CreatePostQuery;
      response: EndpointResponse<CreatePostResponse>;
    };
    signIn: {
      query: SignInQuery;
      response: EndpointResponse<SignInResponse>;
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

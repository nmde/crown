import { CreateAccountQuery } from './schemas/createAccount/Query';
import { CreateAccountResponse } from './schemas/createAccount/Response';
import { CreatePostQuery } from './schemas/createPost/Query';
import { CreatePostResponse } from './schemas/createPost/Response';
import { GetPostQuery } from './schemas/getPost/Query';
import { GetPostResponse } from './schemas/getPost/Response';
import { SignInQuery } from './schemas/signIn/Query';
import { SignInResponse } from './schemas/signIn/Response';

export type EndpointResponse<T> = Promise<{
  data: T;
  error?: string;
}>;

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

export type GET = Endpoints['GET'];
export type POST = Endpoints['POST'];

export type EndpointProvider = {
  [method in keyof GET]: (params: GET[method]['query']) => GET[method]['response'];
} & {
  [method in keyof POST]: (params: POST[method]['query']) => POST[method]['response'];
};

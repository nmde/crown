import { AuthenticateQuery } from './schemas/authenticate/Query';
import { CreateAccountQuery } from './schemas/createAccount/Query';
import { CreateAccountResponse } from './schemas/createAccount/Response';
import { CreateEdgeQuery } from './schemas/createEdge/Query';
import { CreateEdgeResponse } from './schemas/createEdge/Response';
import { CreatePostQuery } from './schemas/createPost/Query';
import { CreatePostResponse } from './schemas/createPost/Response';
import { DeletePostQuery } from './schemas/deletePost/Query';
import { DeletePostResponse } from './schemas/deletePost/Response';
import { GetEdgesQuery } from './schemas/getEdges/Query';
import { GetFeedQuery } from './schemas/getFeed/Query';
import { GetPostQuery } from './schemas/getPost/Query';
import { GetPostResponse } from './schemas/getPost/Response';
import { GetUserQuery } from './schemas/getUser/Query';
import { GetUserResponse } from './schemas/getUser/Response';
import { GetUserByIdQuery } from './schemas/getUserById/Query';
import { SignInQuery } from './schemas/signIn/Query';
import { SignInResponse } from './schemas/signIn/Response';
import { UpdateUserQuery } from './schemas/updateUser/Query';

export type Endpoints = {
  authenticate: {
    query: AuthenticateQuery;
    response: GetUserResponse;
  };
  createAccount: {
    query: CreateAccountQuery;
    response: CreateAccountResponse;
  };
  createEdge: {
    query: CreateEdgeQuery;
    response: CreateEdgeResponse;
  };
  createPost: {
    query: CreatePostQuery;
    response: CreatePostResponse;
  };
  deletePost: {
    query: DeletePostQuery;
    response: DeletePostResponse;
  };
  getEdges: {
    query: GetEdgesQuery;
    response: CreateEdgeResponse[];
  };
  getFeed: {
    query: GetFeedQuery;
    response: GetPostResponse[];
  };
  getPost: {
    query: GetPostQuery;
    response: GetPostResponse;
  };
  getUser: {
    query: GetUserQuery;
    response: GetUserResponse;
  };
  getUserById: {
    query: GetUserByIdQuery;
    response: GetUserResponse;
  };
  signIn: {
    query: SignInQuery;
    response: SignInResponse;
  };
  updateUser: {
    query: UpdateUserQuery;
    response: GetUserResponse;
  };
};

export type Query<T extends keyof Endpoints> = Endpoints[T]['query'];
export type Response<T extends keyof Endpoints> = Endpoints[T]['response'];

export type EndpointProvider = {
  [method in keyof Endpoints]: (params: Query<method>) => Promise<Response<method>>;
};

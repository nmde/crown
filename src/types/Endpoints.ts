/**
 * @file Type definitions for API endpoints.
 */
import { AuthenticateQuery } from './schemas/authenticate/Query';
import { BoostQuery } from './schemas/boost/Query';
import { CreateAccountQuery } from './schemas/createAccount/Query';
import { CreateAccountResponse } from './schemas/createAccount/Response';
import { CreateCommentQuery } from './schemas/createComment/Query';
import { CreateCommentResponse } from './schemas/createComment/Response';
import { CreateEdgeQuery } from './schemas/createEdge/Query';
import { CreateEdgeResponse } from './schemas/createEdge/Response';
import { CreateMessageQuery } from './schemas/createMessage/Query';
import { CreateMessageResponse } from './schemas/createMessage/Response';
import { CreatePostQuery } from './schemas/createPost/Query';
import { CreatePostResponse } from './schemas/createPost/Response';
import { DeleteEdgeQuery } from './schemas/deleteEdge/Query';
import { DeleteEdgeResponse } from './schemas/deleteEdge/Response';
import { DeletePostQuery } from './schemas/deletePost/Query';
import { DeletePostResponse } from './schemas/deletePost/Response';
import { GetCommentsQuery } from './schemas/getComments/Query';
import { GetCommentsResponse } from './schemas/getComments/Response';
import { GetEdgesQuery } from './schemas/getEdges/Query';
import { GetFeedQuery } from './schemas/getFeed/Query';
import { GetMediaQuery } from './schemas/getMedia/Query';
import { GetMessageQuery } from './schemas/getMessage/Query';
import { GetMessageResponse } from './schemas/getMessage/Response';
import { GetPostQuery } from './schemas/getPost/Query';
import { GetPostResponse } from './schemas/getPost/Response';
import { GetUserQuery } from './schemas/getUser/Query';
import { GetUserResponse } from './schemas/getUser/Response';
import { GetUserByIdQuery } from './schemas/getUserById/Query';
import { MessagesQuery } from './schemas/messages/Query';
import { SignInQuery } from './schemas/signIn/Query';
import { SignInResponse } from './schemas/signIn/Response';
import { UpdateUserQuery } from './schemas/updateUser/Query';

export type Endpoints = {
  authenticate: {
    query: AuthenticateQuery;
    response: GetUserResponse;
  };
  boost: {
    query: BoostQuery;
    response: CreateEdgeResponse;
  };
  createAccount: {
    query: CreateAccountQuery;
    response: CreateAccountResponse;
  };
  createComment: {
    query: CreateCommentQuery;
    response: CreateCommentResponse;
  };
  createEdge: {
    query: CreateEdgeQuery;
    response: CreateEdgeResponse;
  };
  createMessage: {
    query: CreateMessageQuery;
    response: CreateMessageResponse;
  };
  createPost: {
    query: CreatePostQuery;
    response: CreatePostResponse;
  };
  deleteEdge: {
    query: DeleteEdgeQuery;
    response: DeleteEdgeResponse;
  };
  deletePost: {
    query: DeletePostQuery;
    response: DeletePostResponse;
  };
  getComments: {
    query: GetCommentsQuery;
    response: GetCommentsResponse;
  };
  getEdges: {
    query: GetEdgesQuery;
    response: CreateEdgeResponse[];
  };
  getFeed: {
    query: GetFeedQuery;
    response: GetPostResponse[];
  };
  getMedia: {
    query: GetMediaQuery;
    response: string;
  };
  getMessage: {
    query: GetMessageQuery;
    response: GetMessageResponse;
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
  messages: {
    query: MessagesQuery;
    response: GetMessageResponse[];
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

export type Query<T extends keyof Endpoints> = Omit<Endpoints[T]['query'], 'token'>;
export type Response<T extends keyof Endpoints> = Endpoints[T]['response'];

export type EndpointProvider = {
  [method in keyof Endpoints]: (query: Endpoints[method]['query']) => Promise<Response<method>>;
};

export type Endpoint = keyof Endpoints;

import { GetPostQuerystring } from './schemas/getPost/Querystring';
import { GetPostResponse } from './schemas/getPost/Response';

export type Endpoints = {
  getPost: {
    params: GetPostQuerystring;
    response: GetPostResponse;
  };
};

export type EndpointProvider = {
  getPost(params: Endpoints['getPost']['params']): Promise<Endpoints['getPost']['response']>;
};

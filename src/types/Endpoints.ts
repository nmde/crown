import UserData from './UserData';
import LoginData from './LoginData';
import PostData from './PostData';

export type GenericResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type Endpoints = {
  post: {
    login: {
      data: LoginData;
      response: UserData;
    };
    createPost: {
      data: PostData;
      response: PostData;
    };
    createUser: {
      data: UserData;
      response: UserData;
    };
  };
  get: {
    getPost: {
      data: {
        id: string;
      };
      response: PostData;
    };
    auth: {
      data: {
        token: string;
      };
      response: UserData;
    };
  };
};

export type EndpointProvider = {
  [key in keyof Endpoints['post']]: (
    data: Endpoints['post'][key]['data'],
  ) => Promise<GenericResponse<Endpoints['post'][key]['response']>>;
} & {
  [key in keyof Endpoints['get']]: (
    data: Endpoints['get'][key]['data'],
  ) => Promise<GenericResponse<Endpoints['get'][key]['response']>>;
};

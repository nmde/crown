import PostData from './PostData';
import Post from '../backend/models/Post';
import User from '../backend/models/User';
import UserData from './UserData';

interface GenericResponse<T> {
  success: boolean;
  data?: T;
  error?: Error;
}

export type CreatePostResponse = GenericResponse<Post>;
export type CreateUserResponse = GenericResponse<User>;
export type GetPostResponse = GenericResponse<Post>;

interface Endpoints {
  createPost: (data: PostData) => Promise<CreatePostResponse>;
  createUser: (data: UserData) => Promise<CreateUserResponse>;
  getPost: (id: string) => Promise<GetPostResponse>;
}

export const EndpointURL: {
  [key in keyof Endpoints]: string;
} = {
  createPost: 'post/createPost',
  createUser: 'post/createUser',
  getPost: 'get/getPost',
};

export default Endpoints;

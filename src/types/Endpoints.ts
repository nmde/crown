import PostData from './PostData';
import Post from '../backend/models/Post';

interface GenericResponse<T> {
  success: boolean;
  data?: T;
  error?: Error;
}

export type CreatePostResponse = GenericResponse<Post>;
export type GetPostResponse = GenericResponse<Post>;

interface Endpoints {
  createPost: (data: PostData) => Promise<CreatePostResponse>;
  getPost: (id: string) => Promise<GetPostResponse>;
}

export const EndpointURL: {
  [key in keyof Endpoints]: string;
} = {
  createPost: 'post/createPost',
  getPost: 'get/getPost',
};

export default Endpoints;

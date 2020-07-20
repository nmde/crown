import axios from 'axios';
import Endpoints, {
  EndpointURL,
  CreatePostResponse,
  GetPostResponse,
  CreateUserResponse,
  LoginResponse,
} from '../types/Endpoints';
import PostData from '../types/PostData';
import UserData from '../types/UserData';
import LoginData from '../types/LoginData';

export default class Client implements Endpoints {
  private baseUrl: string;

  public constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async get<D, T>(endpoint: string, data: D) {
    try {
      return (
        await axios.get(`${this.baseUrl}/${endpoint}`, {
          params: data,
        })
      ).data as T;
    } catch (err) {
      return {
        success: false,
        error: err,
      };
    }
  }

  private async post<D, T>(endpoint: string, data: D) {
    try {
      return (await axios.post(`${this.baseUrl}/${endpoint}`, data)).data as T;
    } catch (err) {
      return {
        success: false,
        error: err,
      };
    }
  }

  public async createPost(data: PostData): Promise<CreatePostResponse> {
    return this.post<PostData, CreatePostResponse>(EndpointURL.createPost, data);
  }

  public async createUser(data: UserData): Promise<CreateUserResponse> {
    return this.post<UserData, CreateUserResponse>(EndpointURL.createUser, data);
  }

  public async getPost(id: string): Promise<GetPostResponse> {
    return this.get<{ id: string }, GetPostResponse>(EndpointURL.getPost, {
      id,
    });
  }

  public async login(data: LoginData): Promise<LoginResponse> {
    return this.post<LoginData, LoginResponse>(EndpointURL.login, data);
  }
}

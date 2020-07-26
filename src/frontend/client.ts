import axios from 'axios';
import { EndpointProvider, GenericResponse } from '../types/Endpoints';
import PostData from '../types/PostData';
import UserData from '../types/UserData';
import LoginData from '../types/LoginData';

export default class Client implements EndpointProvider {
  private baseUrl: string;

  public constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async get<D, T>(endpoint: string, data: D) {
    try {
      return (
        await axios.get(`${this.baseUrl}${endpoint}`, {
          params: data,
        })
      ).data as GenericResponse<T>;
    } catch (err) {
      return {
        success: false,
        error: err,
      };
    }
  }

  private async post<D, T>(endpoint: string, data: D) {
    try {
      return (await axios.post(`${this.baseUrl}${endpoint}`, data)).data as GenericResponse<T>;
    } catch (err) {
      return {
        success: false,
        error: err,
      };
    }
  }

  public async createPost(data: PostData): Promise<GenericResponse<PostData>> {
    return this.post<PostData, PostData>('/api/createPost', data);
  }

  public async createUser(data: UserData): Promise<GenericResponse<UserData>> {
    return this.post<UserData, UserData>('/api/createUser', data);
  }

  public async getPost(query: { id: string }): Promise<GenericResponse<PostData>> {
    return this.get<typeof query, PostData>('/api/getPost', query);
  }

  public async login(data: LoginData): Promise<GenericResponse<UserData>> {
    return this.post<LoginData, UserData>('/api/login', data);
  }
}

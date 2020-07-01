import axios from 'axios';
import Endpoints, { EndpointURL, CreatePostResponse, GetPostResponse } from '../types/Endpoints';
import PostData from '../types/PostData';

export default class Client implements Endpoints {
  private baseUrl: string;

  constructor(baseUrl: string) {
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

  async createPost(data: PostData): Promise<CreatePostResponse> {
    return this.post<PostData, CreatePostResponse>(EndpointURL.createPost, data);
  }

  async getPost(id: string): Promise<GetPostResponse> {
    return this.get<{ id: string }, GetPostResponse>(EndpointURL.getPost, {
      id,
    });
  }
}

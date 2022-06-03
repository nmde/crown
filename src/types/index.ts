import { GetPostResponse } from './schemas/getPost/Response';
import { GetUserResponse } from './schemas/getUser/Response';

export interface IAchievement {
  id: string;
  progress: number;
  user: string;
}

export interface IComment {
  id?: string;
  text: string;
  author: string;
  parent: string;
}

export interface IEdge {
  source: string;
  target: string;
  type: string;
  id?: string;
}

export interface IMedia {
  data: string;
  id?: string;
  mimeType: string;
}

export type MediaRecord = Record<string, string>;

export interface IMessage {
  sender: string;
  content: string;
  time: string;
  recipient: string;
  id?: string;
}

export type IPost = GetPostResponse;

export type IUser = GetUserResponse;

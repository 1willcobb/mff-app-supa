// src/api/types/like.types.ts
import { User } from './index';

export interface Like {
  id: string;
  createdAt: string;
  userId: string;
  postId?: string;
  commentId?: string;
  blogId?: string;
  
  // Relations (optional for response objects that include relations)
  user?: User;
}

export interface CreateLikeRequest {
  userId: string;
  postId?: string;
  commentId?: string;
  blogId?: string;
}

export interface LikesResponse {
  likes: Like[];
  hasNextPage: boolean;
}

export interface HasUserLikedResponse {
  liked: boolean;
}
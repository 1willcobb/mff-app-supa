// src/api/types/post.types.ts
import { User, Comment, Like, Vote } from './index';

export interface Post {
  id: string;
  content?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  likeCount: number;
  commentCount: number;
  voteCount: number;
  camera?: string;
  filmStock?: string;
  lens?: string;
  location?: string;
  settings?: string;
  
  // Relations (optional for response objects that include relations)
  user?: User;
  comments?: Comment[];
  likes?: Like[];
  votes?: Vote[];
}

export interface CreatePostRequest {
  content?: string;
  imageUrl?: string;
  userId: string;
  camera?: string;
  filmStock?: string;
  lens?: string;
  location?: string;
  settings?: string;
}

export interface UpdatePostRequest {
  postId: string;
  content?: string;
  imageUrl?: string;
  camera?: string;
  filmStock?: string;
  lens?: string;
  location?: string;
  settings?: string;
}

export interface PostsResponse {
  posts: Post[];
  hasMore: boolean;
  pageSize: number;
}
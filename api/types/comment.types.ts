// src/api/types/comment.types.ts
import { User, Post, Blog, Like } from './index';

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  postId?: string;
  blogId?: string;
  likeCount: number;
  
  // Relations (optional for response objects that include relations)
  user?: User;
  post?: Post;
  blog?: Blog;
  likes?: Like[];
}

export interface CreateCommentRequest {
  content: string;
  userId: string;
  postId?: string;
  blogId?: string;
}

export interface UpdateCommentRequest {
  commentId: string;
  content: string;
}


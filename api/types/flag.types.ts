import { User, Post, Blog, Comment } from './index';

export interface Flag {
  id: string;
  content?: string;
  createdAt: string;
  userId: string;
  commentId?: string;
  postId?: string;
  blogId?: string;
  
  // Relations (optional for response objects that include relations)
  user?: User;
  post?: Post;
  blog?: Blog;
  comment?: Comment;
}

export interface CreateFlagRequest {
  content?: string;
  userId: string;
  commentId?: string;
  postId?: string;
  blogId?: string;
}

export interface FlagsResponse {
  flags: Flag[];
}
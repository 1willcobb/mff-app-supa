// src/api/types/blog.types.ts
import { User, Comment, Like } from './index';

export interface Blog {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  titleImage?: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  commentCount: number;
  likeCount: number;
  
  // Relations (optional for response objects that include relations)
  author?: User;
  comments?: Comment[];
  likes?: Like[];
}

export interface CreateBlogRequest {
  title: string;
  subtitle?: string;
  content: string;
  titleImage?: string;
  authorId: string;
}

export interface UpdateBlogRequest {
  blogId: string;
  title?: string;
  subtitle?: string;
  content?: string;
  titleImage?: string;
}

export interface BlogsResponse {
  blogs: Blog[];
  page?: number;
  pageSize?: number;
}
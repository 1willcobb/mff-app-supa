// src/api/types/follow.types.ts
import { User } from './index';

export interface UserFollow {
  id: string;
  followerId: string;
  followedId: string;
  createdAt: string;
  
  // Relations (optional for response objects that include relations)
  follower?: User;
  followedUser?: User;
}

export interface FollowRequest {
  followerId: string;
  followedId: string;
}

export interface FollowsResponse {
  follows: UserFollow[];
}
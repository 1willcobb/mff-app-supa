// src/api/types/vote.types.ts
import { User, Post } from './index';

export interface Vote {
  id: string;
  createdAt: string;
  userId: string;
  postId: string;
  value: number;
  
  // Relations (optional for response objects that include relations)
  user?: User;
  post?: Post;
}

export interface CreateVoteRequest {
  userId: string;
  postId: string;
  value: number;
}

export interface VotesResponse {
  votes: Vote[];
}

export interface HasUserVotedResponse {
  hasVoted: boolean;
}
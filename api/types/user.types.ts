// src/api/types/user.types.ts

export enum Role {
  FRIEND = 'FRIEND',
  GUEST = 'GUEST',
  MODERATOR = 'MODERATOR',
  SUPERADMIN = 'SUPERADMIN'
}

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  isAdmin: boolean;
  followerCount: number;
  followingCount: number;
  postCount: number;
  profileImage?: string;
  displayName?: string;
  role: Role;
  userBio?: string;
  betaAccess: boolean;
  link?: string;
  linkAltName?: string;
  status: Status;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserRegistration {
  name: string;
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  sessionId: string;
}
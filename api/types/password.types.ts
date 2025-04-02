// src/api/types/password.types.ts
import { User } from './index';

export interface PasswordResetToken {
  id: string;
  token: string;
  userId: string;
  expiration: string;
  createdAt: string;
  
  // Relations (optional for response objects that include relations)
  user?: User;
}

export interface RequestPasswordResetRequest {
  email: string;
}

export interface RequestPasswordResetResponse {
  message: string;
  token: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}
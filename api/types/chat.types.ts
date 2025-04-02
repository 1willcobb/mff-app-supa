// src/api/types/chat.types.ts
import { User, Message } from './index';

export interface Chat {
  id: string;
  createdAt: string;
  updatedAt: string;
  
  // Relations (optional for response objects that include relations)
  participants?: User[];
  messages?: Message[];
}

export interface CreateChatRequest {
  participantIds: string[];
}

export interface UserChat {
  chatId: string;
  participantName: string;
  participantId: string;
  participantImage?: string;
}
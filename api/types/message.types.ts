/ src/api/types/message.types.ts
import { User, Chat } from './index';

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  chatId: string;
  
  // Relations (optional for response objects that include relations)
  user?: User;
  chat?: Chat;
}

export interface CreateMessageRequest {
  content: string;
  userId: string;
  chatId: string;
}

export interface MessagesResponse {
  messages: Message[];
  page?: number;
  pageSize?: number;
}
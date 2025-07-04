import { User } from './user.model';
import { Issue } from './issue.model';

export interface Comment {
  id_comment: number;
  id_issue: number;
  id_user: number;
  content: string;
  created_at: string;
  updated_at: string;
  
  // Relazioni opzionali per il frontend
  user?: User;
  issue?: Issue;
}

export interface CreateCommentRequest {
  id_issue: number;
  id_user: number;
  content: string;
}

export interface UpdateCommentRequest {
  content: string;
}

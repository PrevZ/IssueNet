import { User } from './user.model';
import { Issue } from './issue.model';

// Interfaccia principale per un commento
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

// Richiesta per creare un nuovo commento
export interface CreateCommentRequest {
  id_issue: number;
  id_user: number;
  content: string;
}

// Richiesta per aggiornare un commento esistente
export interface UpdateCommentRequest {
  content: string;
}

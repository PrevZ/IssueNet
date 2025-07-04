import { User } from './user.model';

export interface Project {
  id_project: number;
  name: string;
  description?: string;
  created_by: number;
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
  
  // Relazioni opzionali per il frontend
  creator?: User;
  issuesCount?: number;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  created_by: number;
  status?: 'active' | 'archived';
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: 'active' | 'archived';
}

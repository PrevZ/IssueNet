import { User } from './user.model';
import { Project } from './project.model';

export interface Issue {
  id_issue: number;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'todo' | 'in_progress' | 'in_review' | 'done';
  type: 'bug' | 'feature' | 'task' | 'improvement';
  id_project: number;
  assigned_to?: number;
  created_by: number;
  estimated_hours?: number;
  actual_hours?: number;
  due_date?: string;
  created_at: string;
  updated_at: string;
  
  // Relazioni opzionali per il frontend
  project?: Project;
  assignee?: User;
  creator?: User;
  commentsCount?: number;
}

export interface CreateIssueRequest {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  status?: 'todo' | 'in_progress' | 'in_review' | 'done';
  type?: 'bug' | 'feature' | 'task' | 'improvement';
  id_project: number;
  assigned_to?: number;
  created_by: number;
  estimated_hours?: number;
  due_date?: string;
}

export interface UpdateIssueRequest {
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  status?: 'todo' | 'in_progress' | 'in_review' | 'done';
  type?: 'bug' | 'feature' | 'task' | 'improvement';
  assigned_to?: number;
  estimated_hours?: number;
  actual_hours?: number;
  due_date?: string;
}

// Utility types per la Kanban board
export interface IssueColumn {
  status: 'todo' | 'in_progress' | 'in_review' | 'done';
  title: string;
  issues: Issue[];
}

export const ISSUE_STATUSES = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'in_review', label: 'In Review' },
  { value: 'done', label: 'Done' }
] as const;

export const ISSUE_PRIORITIES = [
  { value: 'low', label: 'Low', color: '#4CAF50' },
  { value: 'medium', label: 'Medium', color: '#FF9800' },
  { value: 'high', label: 'High', color: '#F44336' },
  { value: 'critical', label: 'Critical', color: '#9C27B0' }
] as const;

export const ISSUE_TYPES = [
  { value: 'bug', label: 'Bug', icon: 'bug_report' },
  { value: 'feature', label: 'Feature', icon: 'star' },
  { value: 'task', label: 'Task', icon: 'assignment' },
  { value: 'improvement', label: 'Improvement', icon: 'trending_up' }
] as const;

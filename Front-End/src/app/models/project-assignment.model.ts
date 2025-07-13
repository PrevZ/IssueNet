export interface ProjectAssignment {
  id_assignment?: number;
  id_project: number;
  id_user: number;
  assigned_date: string;
  role_in_project: 'admin' | 'developer' | 'tester';
  is_active: boolean;
}

export interface ProjectAssignmentWithDetails {
  id_assignment: number;
  id_project: number;
  id_user: number;
  assigned_date: string;
  role_in_project: 'admin' | 'developer' | 'tester';
  is_active: boolean;
  project_name: string;
  project_description?: string;
  user_full_name: string;
  user_email: string;
  user_username: string;
}

export interface CreateProjectAssignmentRequest {
  id_project: number;
  id_user: number;
  role_in_project: 'admin' | 'developer' | 'tester';
}

export interface UpdateProjectAssignmentRequest {
  role_in_project?: 'admin' | 'developer' | 'tester';
  is_active?: boolean;
}

export interface ProjectMember {
  id_user: number;
  full_name: string;
  email: string;
  username: string;
  role_in_project: 'admin' | 'developer' | 'tester';
  assigned_date: string;
  is_active: boolean;
}

export interface UserProject {
  id_project: number;
  name: string;
  description?: string;
  role_in_project: 'admin' | 'developer' | 'tester';
  assigned_date: string;
  is_active: boolean;
}

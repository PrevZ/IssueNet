export interface User {
  id_user: number;
  username: string;
  email: string;
  password?: string; // Opzionale per non esporre la password nel frontend
  full_name: string;
  role: 'admin' | 'developer' | 'tester';
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  full_name: string;
  role?: 'admin' | 'developer' | 'tester';
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  password?: string;
  full_name?: string;
  role?: 'admin' | 'developer' | 'tester';
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'developer' | 'tester';
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token?: string; // Se utilizzi JWT
}

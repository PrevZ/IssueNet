// Interfaccia principale per l'utente
export interface User {
  id_user: number;
  username: string;
  email: string;
  password?: string; // Opzionale per non esporre la password nel frontend
  full_name: string;
  role: 'admin' | 'project_manager' | 'developer' | 'tester';
  created_at?: string; // Data di registrazione dell'utente
}

// Richiesta per creare un nuovo utente
export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  full_name: string;
  role?: 'admin' | 'project_manager' | 'developer' | 'tester';
}

// Richiesta per aggiornare un utente esistente
export interface UpdateUserRequest {
  username?: string;
  email?: string;
  password?: string;
  full_name?: string;
  role?: 'admin' | 'project_manager' | 'developer' | 'tester';
}

// Richiesta per registrazione di un nuovo utente
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'project_manager' | 'developer' | 'tester';
}

// Richiesta per il login
export interface LoginRequest {
  username: string;
  password: string;
}

// Risposta del login con dati utente
export interface LoginResponse {
  user: User;
  token?: string; 
}

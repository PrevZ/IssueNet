import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, CreateUserRequest, RegisterRequest, LoginRequest, LoginResponse, UpdateUserRequest } from '../models';
import { ApiConfigService } from './api-config.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly endpoint = '/users';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) {
    // Carica l'utente dal localStorage se presente
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  // Registra un nuovo utente
  register(registerData: RegisterRequest): Observable<User> {
    const userData = {
      username: registerData.username,
      email: registerData.email,
      password: registerData.password,
      full_name: `${registerData.firstName} ${registerData.lastName}`,
      role: registerData.role || 'developer'
    };
    
    return this.http.post<User>(this.apiConfig.getApiUrl(`${this.endpoint}/register`), userData);
  }

  // Login
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiConfig.getApiUrl(`${this.endpoint}/login`), credentials)
      .pipe(
        tap(response => {
          // Salva l'utente corrente
          this.currentUserSubject.next(response.user);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          
          // Salva il token se presente
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
        })
      );
  }

  // Logout
  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  }

  // Ottieni l'utente corrente
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Verifica se l'utente è autenticato
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  // Aggiorna profilo utente
  updateProfile(id: number, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(this.apiConfig.getApiUrl(`${this.endpoint}/${id}`), userData)
      .pipe(
        tap(updatedUser => {
          // Aggiorna l'utente corrente se è quello che stiamo modificando
          if (this.currentUserSubject.value?.id_user === id) {
            this.currentUserSubject.next(updatedUser);
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          }
        })
      );
  }

  // Ottieni tutti gli utenti (solo per admin)
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiConfig.getApiUrl(this.endpoint));
  }

  // Ottieni utente per ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(this.apiConfig.getApiUrl(`${this.endpoint}/${id}`));
  }

  // Crea nuovo utente (solo per admin)
  createUser(userData: CreateUserRequest): Observable<User> {
    return this.http.post<User>(this.apiConfig.getApiUrl(this.endpoint), userData);
  }

  // Aggiorna utente esistente (admin o stesso utente)
  updateUser(id: number, userData: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(this.apiConfig.getApiUrl(`${this.endpoint}/${id}`), userData)
      .pipe(
        tap(updatedUser => {
          // Aggiorna l'utente corrente se è quello che stiamo modificando
          if (this.currentUserSubject.value?.id_user === id) {
            this.currentUserSubject.next(updatedUser);
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          }
        })
      );
  }

  // Elimina utente (solo per admin)
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(this.apiConfig.getApiUrl(`${this.endpoint}/${id}`));
  }

  // Ottieni utenti per ruolo
  getUsersByRole(role: string): Observable<User[]> {
    return this.http.get<User[]>(this.apiConfig.getApiUrl(`${this.endpoint}/role/${role}`));
  }
}

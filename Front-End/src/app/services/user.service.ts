import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, CreateUserRequest, LoginRequest, LoginResponse } from '../models';
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

  // Ottieni tutti gli utenti
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiConfig.getApiUrl(this.endpoint));
  }

  // Ottieni un utente per ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(this.apiConfig.getApiUrl(`${this.endpoint}/${id}`));
  }

  // Registra un nuovo utente
  register(user: CreateUserRequest): Observable<User> {
    return this.http.post<User>(this.apiConfig.getApiUrl(`${this.endpoint}/register`), user);
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
}

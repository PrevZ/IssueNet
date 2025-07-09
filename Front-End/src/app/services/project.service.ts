import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, CreateProjectRequest, UpdateProjectRequest } from '../models';
import { ApiConfigService } from './api-config.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly endpoint = '/projects';

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) { }

  // Ottieni tutti i progetti
  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiConfig.getApiUrl(this.endpoint));
  }

  // Ottieni un progetto per ID
  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(this.apiConfig.getApiUrl(`${this.endpoint}/${id}`));
  }

  // Crea un nuovo progetto
  createProject(project: CreateProjectRequest): Observable<Project> {
    return this.http.post<Project>(this.apiConfig.getApiUrl(this.endpoint), project);
  }

  // Aggiorna un progetto
  updateProject(id: number, project: UpdateProjectRequest): Observable<Project> {
    return this.http.put<Project>(this.apiConfig.getApiUrl(`${this.endpoint}/${id}`), project);
  }

  // Elimina un progetto
  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(this.apiConfig.getApiUrl(`${this.endpoint}/${id}`));
  }

  // Ottieni progetti dell'utente
  getProjectsByUser(userId: number): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiConfig.getApiUrl(`${this.endpoint}/user/${userId}`));
  }

  // Ottieni progetti dell'utente con statistiche dettagliate
  getEnhancedProjectsByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(this.apiConfig.getApiUrl(`${this.endpoint}/user/${userId}/enhanced`));
  }

  // Ottieni statistiche aggregate dell'utente
  getUserProjectStats(userId: number): Observable<any> {
    return this.http.get<any>(this.apiConfig.getApiUrl(`${this.endpoint}/user/${userId}/stats`));
  }
}

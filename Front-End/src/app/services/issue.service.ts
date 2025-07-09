import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Issue, CreateIssueRequest, UpdateIssueRequest } from '../models';
import { ApiConfigService } from './api-config.service';

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  private readonly endpoint = '/issues';

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) { }

  // Ottieni tutti gli issue
  getAllIssues(): Observable<Issue[]> {
    return this.http.get<Issue[]>(this.apiConfig.getApiUrl(this.endpoint));
  }

  // Ottieni un issue per ID
  getIssueById(id: number): Observable<Issue> {
    return this.http.get<Issue>(this.apiConfig.getApiUrl(`${this.endpoint}/${id}`));
  }

  // Ottieni issue per progetto
  getIssuesByProject(projectId: number): Observable<Issue[]> {
    return this.http.get<Issue[]>(this.apiConfig.getApiUrl(`${this.endpoint}/project/${projectId}`));
  }

  // Ottieni issue assegnati a un utente
  getIssuesByAssignee(userId: number): Observable<Issue[]> {
    return this.http.get<Issue[]>(this.apiConfig.getApiUrl(`${this.endpoint}/my/${userId}`));
  }

  // Crea un nuovo issue
  createIssue(issue: CreateIssueRequest): Observable<Issue> {
    return this.http.post<Issue>(this.apiConfig.getApiUrl(this.endpoint), issue);
  }

  // Aggiorna un issue
  updateIssue(id: number, issue: UpdateIssueRequest): Observable<Issue> {
    return this.http.put<Issue>(this.apiConfig.getApiUrl(`${this.endpoint}/${id}`), issue);
  }

  // Aggiorna solo lo status di un issue (per drag & drop)
  updateIssueStatus(id: number, status: 'todo' | 'in_progress' | 'in_review' | 'done'): Observable<Issue> {
    return this.http.patch<Issue>(this.apiConfig.getApiUrl(`${this.endpoint}/${id}/status`), { status });
  }

  // Elimina un issue
  deleteIssue(id: number): Observable<void> {
    return this.http.delete<void>(this.apiConfig.getApiUrl(`${this.endpoint}/${id}`));
  }
}

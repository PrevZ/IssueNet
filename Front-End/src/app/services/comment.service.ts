import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment, CreateCommentRequest, UpdateCommentRequest } from '../models';
import { ApiConfigService } from './api-config.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private readonly endpoint = '/comments';

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) { }

  // Ottieni commenti per un issue
  getCommentsByIssue(issueId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.apiConfig.getApiUrl(`${this.endpoint}/issue/${issueId}`));
  }

  // Ottieni commenti per un utente
  getCommentsByUser(userId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.apiConfig.getApiUrl(`${this.endpoint}/user/${userId}`));
  }

  // Ottieni un commento per ID
  getCommentById(id: number): Observable<Comment> {
    return this.http.get<Comment>(this.apiConfig.getApiUrl(`${this.endpoint}/${id}`));
  }

  // Crea un nuovo commento
  createComment(comment: CreateCommentRequest): Observable<Comment> {
    return this.http.post<Comment>(this.apiConfig.getApiUrl(this.endpoint), comment);
  }

  // Aggiorna un commento
  updateComment(id: number, comment: UpdateCommentRequest): Observable<Comment> {
    return this.http.put<Comment>(this.apiConfig.getApiUrl(`${this.endpoint}/${id}`), comment);
  }

  // Elimina un commento
  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(this.apiConfig.getApiUrl(`${this.endpoint}/${id}`));
  }
}

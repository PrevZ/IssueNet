import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  // URL base del backend con context path
  private readonly baseUrl = 'http://localhost:3000/api'; 
  
  constructor() { }

  getApiUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }
}

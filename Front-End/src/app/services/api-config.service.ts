import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  // URL base del tuo backend
  private readonly baseUrl = 'http://localhost:3000'; // Modifica con la porta del tuo backend
  
  constructor() { }

  getApiUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }
}

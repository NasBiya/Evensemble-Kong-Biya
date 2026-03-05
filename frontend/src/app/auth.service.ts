import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // L'adresse de ton backend
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  register(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/register`, { email, password });
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(reponse => {
        if (reponse.token) {
          localStorage.setItem('token', reponse.token);
        }
      })
    );
  }

  estConnecte(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    const token = localStorage.getItem('token');
    if (token) {
      return this.http.post(`${this.apiUrl}/logout`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).pipe(
        tap(() => {
          localStorage.removeItem('token');
        })
      );
    }
    localStorage.removeItem('token');
    return null;
  }
}
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

  // 1. Fonction pour s'inscrire (Comme dans Thunder Client)
  register(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/register`, { email, password });
  }

  // 2. Fonction pour se connecter
  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(reponse => {
        // MAGIE : Quand le backend répond "Sign in successful" avec le token,
        // on sauvegarde ce token dans le navigateur pour s'en souvenir !
        if (reponse.token) {
          localStorage.setItem('token', reponse.token);
        }
      })
    );
  }

  // 3. Vérifier si un utilisateur est connecté (Pratique pour afficher/cacher des boutons)
  estConnecte(): boolean {
    return !!localStorage.getItem('token');
  }

  // 4. Se déconnecter (On jette le bracelet VIP)
  logout() {
    localStorage.removeItem('token');
  }
}
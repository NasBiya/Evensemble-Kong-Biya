import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransportService {
  private apiUrl = 'http://localhost:3000/api/transport';

  constructor(private http: HttpClient) {}

  // Fonction pour appeler notre Backend
  // On ajoute "departureTime" comme texte optionnel (?)
  rechercherTrajet(depart: string, arrivee: string, mode: number, departureTime?: string): Observable<any[]> {
    let url = `${this.apiUrl}?depart=${depart}&arrivee=${arrivee}&mode=${mode}`;
    
    // Si on a calculé une date/heure, on l'ajoute au lien
    if (departureTime) {
      url += `&departure_time=${departureTime}`;
    }
    
    return this.http.get<any[]>(url);
  }
}
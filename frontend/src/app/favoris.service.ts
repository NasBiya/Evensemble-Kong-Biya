import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private apiUrl = 'http://localhost:3000/api/favorites';
  
  // Ce BehaviorSubject permet à Angular de mettre à jour l'étoile instantanément 
  private favorisSource = new BehaviorSubject<any[]>([]);
  favoris$ = this.favorisSource.asObservable();

  constructor(private http: HttpClient) {
    // Si on est connecté au démarrage, on charge les favoris
    if (this.estConnecte()) {
      this.chargerFavoris();
    }
  }

  // Vérifie si l'utilisateur a un token
  private estConnecte(): boolean {
    return !!localStorage.getItem('token');
  }

  // Prépare le token pour le Backend
  private getHeaders() {
    const token = localStorage.getItem('token');
    return { headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` }) };
  }

  //charger les favoris
  chargerFavoris() {
    if (!this.estConnecte()) return;
    this.http.get<any[]>(this.apiUrl, this.getHeaders()).subscribe({
      next: (favs) => this.favorisSource.next(favs),
      error: (err) => console.error('Erreur chargement favoris', err)
    });
  }

  // Vérifie si un événement est dans la liste
  isFavori(title: string): boolean {
    return this.favorisSource.value.some(fav => fav.title === title);
  }

  //gestion sur btn de l'etoile
  toggleFavori(event: any) {
    if (!this.estConnecte()) {
      alert("⚠️ Veuillez vous connecter d'abord pour ajouter un favori !");
      return;
    }

    const dejaFavori = this.isFavori(event.title);

    if (dejaFavori) {
      // SUPPRESSION
      this.http.delete<any[]>(`${this.apiUrl}/${event.id}`, this.getHeaders()).subscribe({
        next: (newFavs) => this.favorisSource.next(newFavs),
        error: (err) => {
          console.error("Erreur lors de la suppression :", err);
          alert("Erreur serveur lors de la suppression.");
        }
      });
    } else {
      // AJOUT
      const favData = {
        id: event.id,
        title: event.title,
        displayDate: event.displayDate,
        location: event.location,
        thumbnail: event.thumbnail
      };

      console.log("Envoi du favori au backend...", favData); // Pour vérifier qu'on envoie bien les données

      this.http.post<any[]>(this.apiUrl, favData, this.getHeaders()).subscribe({
        next: (newFavs) => {
          console.log("Succès ! Favori ajouté :", newFavs);
          this.favorisSource.next(newFavs); // allume l'étoile en jaune !
        },
        error: (err) => {
          console.error("Erreur lors de l'ajout :", err);
          alert("Impossible d'ajouter le favori. Regarde la console F12.");
        }
      });
    }
  }
}
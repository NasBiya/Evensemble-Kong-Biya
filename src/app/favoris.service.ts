import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' 
})
export class FavorisService {
  // tableau qui stocke les événements favoris
  private favorisList: any[] = [];

  // Récupérer la liste
  getFavoris() {
    return this.favorisList;
  }

  // Ajouter ou retirer un favori 
  toggleFavori(event: any) {
    const index = this.favorisList.findIndex(e => e.id === event.id);
    if (index > -1) {
      // S'il est déjà dans la liste, on le retire
      this.favorisList.splice(index, 1);
    } else {
      // Sinon, on l'ajoute
      this.favorisList.push(event);
    }
  }

  // Vérifier si un événement est dans les favoris
  isFavori(eventId: number): boolean {
    return this.favorisList.some(e => e.id === eventId);
  }
}
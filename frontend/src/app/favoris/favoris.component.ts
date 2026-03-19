import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FavoritesService } from '../favoris.service'; // Importer le service

@Component({
  selector: 'app-favoris',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './favoris.component.html',
  styleUrl: './favoris.component.css'
})
export class FavorisComponent implements OnInit {
  // Le tableau qui va recevoir les favoris pour l'affichage
  mesFavoris: any[] = [];

  constructor(private favoritesService: FavoritesService) {}

  // Quand la page se charge, on récupère la liste
  ngOnInit(): void {
    // On demande au service de charger les favoris depuis MongoDB
    this.favoritesService.chargerFavoris();

    // On écoute la liste en temps réel
    this.favoritesService.favoris$.subscribe({
      next: (favs) => {
        this.mesFavoris = favs;
      }
    });
  }

  // Fonction pour retirer un favori directement depuis cette page
  retirer(event: any) {
    // Le service gère la suppression, et l'observable
    this.favoritesService.toggleFavori(event);
  }
}
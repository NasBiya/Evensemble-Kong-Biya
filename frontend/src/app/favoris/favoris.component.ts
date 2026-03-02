import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FavorisService } from '../favoris.service'; //Importer le service

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

  constructor(private favorisService: FavorisService) {}

  // Quand la page se charge, on récupère la liste
  ngOnInit() {
    this.mesFavoris = this.favorisService.getFavoris();
  }

  // Fonction pour retirer un favori directement depuis cette page
  retirer(event: any) {
    this.favorisService.toggleFavori(event);
    this.mesFavoris = this.favorisService.getFavoris(); // Mise à jour de la liste
  }
}
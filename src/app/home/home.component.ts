import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // 1. On importe le module commun

@Component({
  selector: 'app-home',
  standalone: true,
  // 2. On l'ajoute ici pour avoir le droit d'utiliser *ngFor
  imports: [CommonModule], 
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  // Pas besoin de logique complexe pour l'instant
}
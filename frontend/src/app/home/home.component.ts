import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router, RouterModule } from '@angular/router'; // Ajout de RouterModule
import { AuthService } from '../auth.service';
import { EventService, GoogleEvent } from '../services/event.service'; // On importe le service et le modèle !

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  
  // Nouvelles variables pour stocker nos événements dynamiques
  recommendedEvents: GoogleEvent[] = [];
  loadingEvents = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private eventService: EventService // On injecte le service ici
  ) {}

  ngOnInit(): void {
    // Si l'utilisateur est connecté, on le redirige
    if (this.authService.estConnecte()) {
      this.router.navigate(['/carte']);
    } else {
      // Sinon, on charge les événements pour décorer la page d'accueil !
      this.chargerEvenementsRecommandes();
    }
  }

  // Fonction qui va chercher les vrais événements
  chargerEvenementsRecommandes() {
    this.loadingEvents = true;
    
    this.eventService.getEvents('Le Mans').subscribe({
      next: (data) => {
        // On prend les 8 premiers événements pour avoir un beau ruban
        this.recommendedEvents = data.slice(0, 8);
        this.loadingEvents = false;
      },
      error: (err) => {
        console.error('Erreur API sur la page accueil', err);
        this.loadingEvents = false;
      }
    });
  }
}
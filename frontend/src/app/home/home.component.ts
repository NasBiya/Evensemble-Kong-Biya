import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // On importe le module commun
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  // pour avoir le droit d'utiliser *ngFor
  imports: [CommonModule], 
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Si l'utilisateur est connecté, rediriger vers la carte
    if (this.authService.estConnecte()) {
      this.router.navigate(['/carte']);
    }
  }
}
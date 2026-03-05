import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private authService: AuthService, private router: Router) {}

  estConnecte(): boolean {
    return this.authService.estConnecte();
  }

  seDeconnecter() {
    const resultat = this.authService.logout();
    if (resultat) {
      resultat.subscribe({
        next: () => {
          console.log('Déconnecté avec succès');
          this.router.navigate(['/login']);
        },
        error: (erreur) => {
          console.error('Erreur lors déconnexion:', erreur);
          // On déconnecte quand même localement
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }
}

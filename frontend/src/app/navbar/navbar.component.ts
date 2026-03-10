import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  searchQuery = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private searchService: SearchService
  ) {}

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.searchService.setQuery(this.searchQuery.trim());
    }
  }

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
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }
}
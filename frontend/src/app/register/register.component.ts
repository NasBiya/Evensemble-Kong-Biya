import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // Pour changer de page
import { AuthService } from '../auth.service'; // Ton super service !
import { FormsModule } from '@angular/forms'; // Indispensable pour récupérer ce que l'utilisateur tape
import { CommonModule } from '@angular/common'; // Pour afficher des messages d'erreur si besoin

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule], 
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  // Les variables qui vont stocker ce que l'utilisateur tape
  email = '';
  password = '';
  confirmPassword = '';
  messageErreur = '';

  // On injecte le service d'authentification et le routeur
  constructor(private authService: AuthService, private router: Router) {}

  // La fonction qui se lance quand on clique sur le bouton "S'inscrire"
  onRegister() {
    // 1. On vérifie d'abord que les mots de passe sont identiques
    if (this.password !== this.confirmPassword) {
      this.messageErreur = "Les mots de passe ne correspondent pas !";
      return; // On arrête la fonction ici
    }

    // 2. Si c'est bon, on contacte le backend Node.js
    this.authService.register(this.email, this.password).subscribe({
      next: (reponse) => {
        alert("Compte créé avec succès ! Tu peux maintenant te connecter.");
        this.router.navigate(['/login']); 
      },
      error: (erreur) => {
        this.messageErreur = "Erreur lors de l'inscription. L'identifiant est peut-être déjà utilisé.";
      }
    });
  }
}
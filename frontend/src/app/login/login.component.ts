import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  messageErreur = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.email, this.password).subscribe({
      next: (reponse) => {
        
        console.log("Connexion réussie ! Token :", reponse.token);
        
        // On redirige l'utilisateur vers sa page principale
        this.router.navigate(['/carte']); 
      },
      error: (erreur) => {
        this.messageErreur = "Identifiant ou mot de passe incorrect.";
      }
    });
  }
}
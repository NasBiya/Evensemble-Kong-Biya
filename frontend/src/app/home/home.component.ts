import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // On importe le module commun

@Component({
  selector: 'app-home',
  standalone: true,
  // pour avoir le droit d'utiliser *ngFor
  imports: [CommonModule], 
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
}
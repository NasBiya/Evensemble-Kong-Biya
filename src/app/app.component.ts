import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// On importe les composants 
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  // On les ajoute dans la liste des imports :
  imports: [RouterOutlet, NavbarComponent, FooterComponent], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'evensemble';
}
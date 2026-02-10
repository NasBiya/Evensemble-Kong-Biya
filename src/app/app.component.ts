import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// 1. On importe les composants qu'on veut utiliser
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  // 2. On les ajoute dans la liste des imports ICI :
  imports: [RouterOutlet, NavbarComponent, FooterComponent], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'evensemble';
}
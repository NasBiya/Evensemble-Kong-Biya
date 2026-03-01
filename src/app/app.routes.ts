import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ContactComponent } from './contact/contact.component';
import { ErreurComponent } from './erreur/erreur.component';
import { CarteComponent } from './carte/carte.component';
import { ProfilComponent } from './profil/profil.component';
import { FavorisComponent } from './favoris/favoris.component';   
import { ParametresComponent } from './parametres/parametres.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },           // Page d'accueil par défaut
  { path: 'login', component: LoginComponent },     // Lien /login
  { path: 'register', component: RegisterComponent }, // Lien /register
  { path: 'contact', component: ContactComponent },   // Lien /contact
  { path: 'carte', component: CarteComponent },
  { path: 'profil', component: ProfilComponent},
  { path: 'favoris', component: FavorisComponent },
  { path: 'parametres', component: ParametresComponent },
  { path: '**', component: ErreurComponent }     // Si l'URL n'existe pas, retour accueil

];
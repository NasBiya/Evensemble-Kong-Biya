import { Component, OnInit } from '@angular/core'; // Ajoute OnInit
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // OBLIGATOIRE pour les formulaires dynamiques
import { TransportService } from '../transport.service'; // Ajuste le chemin si besoin
import { ActivatedRoute } from '@angular/router';  // Ajoute ActivatedRoute

@Component({
  selector: 'app-transport',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transport.component.html',
  styleUrl: './transport.component.css'
})
export class TransportComponent implements OnInit{
  // Les variables liées au formulaire HTML
  depart: string = '';
  arrivee: string = '';
  modeSelectionne: number = 3; // Par défaut : 3 (Métro/Bus)
  modeRecherche: number = 3;   // NOUVEAU : Ce qui fige l'icône des résultats !
  // Nouvelles variables pour lire ce que tu tapes dans le menu
  dateDepart: string = '';
  heureDepart: string = '';
  // Les variables figées pour l'affichage des résultats !
  departRecherche: string = '';
  arriveeRecherche: string = '';
  //Les variables figées pour la date et l'heure !
  dateRecherche: string = '';
  heureRecherche: string = '';

  // Ajoute la route dans ton constructeur
  constructor(private transportService: TransportService, private route: ActivatedRoute) {}

  // Cette fonction se lance toute seule quand la page s'ouvre
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['arrivee']) {
        this.arrivee = params['arrivee']; // 🪄 Remplit la case automatiquement !
      }
    });
  }

  // 1. Calcule l'heure de départ parfaite
  getHeureDepart(route: any): string {
    // On regarde l'heure figée
    if (this.heureRecherche) {
      return this.heureRecherche;
    }
    if (route.legs && route.legs[0]?.departure_time) {
      return route.legs[0].departure_time.text;
    }
    // On regarde la date figée
    if (this.dateRecherche) {
      const dateChoisie = new Date(this.dateRecherche);
      const aujourdhui = new Date();
      dateChoisie.setHours(0, 0, 0, 0);
      aujourdhui.setHours(0, 0, 0, 0);

      if (dateChoisie > aujourdhui) {
        return "06:00"; 
      }
    }
    const maintenant = new Date();
    return maintenant.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  // 2. Calcule l'heure d'arrivée correspondante
  getHeureArrivee(route: any): string {
    // On regarde l'heure figée ici aussi
    if (!this.heureRecherche && route.legs && route.legs[0]?.arrival_time) {
      return route.legs[0].arrival_time.text;
    }

    // Sinon, on calcule mathématiquement : Heure de départ + Durée du trajet
    const heureDepartBase = this.getHeureDepart(route);
    const dureeTexte = route.formatted_duration || route.duration?.text || '';

    let minutesAAjouter = 0;
    const heuresMatch = dureeTexte.match(/(\d+)\s*(h|heure|hour)/i);
    if (heuresMatch) minutesAAjouter += parseInt(heuresMatch[1]) * 60;

    const minMatch = dureeTexte.match(/(\d+)\s*m/i);
    if (minMatch) minutesAAjouter += parseInt(minMatch[1]);

    // On extrait l'heure et les minutes de l'heure de départ
    let h = 0, m = 0;
    const timeMatch = heureDepartBase.match(/(\d{1,2})[^\d]+(\d{2})/);
    if (timeMatch) {
      h = parseInt(timeMatch[1]);
      m = parseInt(timeMatch[2]);
    } else {
      const d = new Date();
      h = d.getHours();
      m = d.getMinutes();
    }

    const dateArrivee = new Date();
    dateArrivee.setHours(h, m + minutesAAjouter);

    // On renvoie l'heure calculée au format HH:MM
    return dateArrivee.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
  
  // La liste des résultats
  itineraires: any[] = [];
  enChargement: boolean = false;

  // Nouvelle variable pour stocker le texte de l'erreur
  erreurMessage: string = '';

  lancerRecherche() {
    if (!this.depart || !this.arrivee) {
      alert("Veuillez entrer un départ et une arrivée !");
      return;
    }

    this.departRecherche = this.depart;
    this.arriveeRecherche = this.arrivee;
    this.modeRecherche = this.modeSelectionne;
    this.dateRecherche = this.dateDepart;  
    this.heureRecherche = this.heureDepart; 

    this.enChargement = true;
    this.itineraires = [];
    this.erreurMessage = '';

    //LE NOUVEAU CALCUL DU TIMESTAMP 
    let timestampDepart = '';
    
    if (this.dateDepart || this.heureDepart) {
      // Si pas de date saisie, on prend aujourd'hui
      const dateChoisie = this.dateDepart ? this.dateDepart : new Date().toISOString().split('T')[0];
      
      // Si pas d'heure saisie, on réfléchit...
      let heureChoisie = this.heureDepart;
      if (!heureChoisie) {
         const d = new Date();
         const auj = d.toISOString().split('T')[0];
         // Si c'est un jour futur, on force 06h00. Si c'est aujourd'hui, on prend l'heure de maintenant
         heureChoisie = (dateChoisie > auj) ? "06:00" : `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
      }

      // On fusionne et on convertit en secondes (Timestamp)
      const dateComplete = new Date(`${dateChoisie}T${heureChoisie}:00`);
      timestampDepart = Math.floor(dateComplete.getTime() / 1000).toString();
    }
    // -------------------------------------------

    // On lance la recherche en envoyant notre timestamp (timestampDepart) à la fin !
    this.transportService.rechercherTrajet(this.depart, this.arrivee, this.modeSelectionne, timestampDepart).subscribe({
      next: (data) => {
        if (!data || data.length === 0) {
          this.erreurMessage = "Aucun itinéraire trouvé. Vérifiez vos adresses ou essayez un autre moyen de transport !";
        } else {
          this.itineraires = data;
        }
        this.enChargement = false;
      },
      error: (err) => {
        console.error("Erreur de recherche", err);
        this.erreurMessage = "Impossible de calculer ce trajet pour le moment.";
        this.enChargement = false;
      }
    });
  }

  // Nouvelle fonction pour rediriger vers Google Maps
  ouvrirGoogleMaps() {
    // On traduit ton "modeSelectionne" (codes SerpApi) en codes compris par Google Maps
    let googleMode = 'transit'; // Métro/Bus par défaut
    if (this.modeSelectionne == 0) googleMode = 'driving'; // Voiture
    if (this.modeSelectionne == 2) googleMode = 'walking'; // Marche (maintenant 2)
    if (this.modeSelectionne == 1) googleMode = 'bicycling'; // Vélo (maintenant 1)

    // On crée l'URL officielle de Google Maps Directions
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(this.depart)}&destination=${encodeURIComponent(this.arrivee)}&travelmode=${googleMode}`;
    
    // On ouvre le lien dans un nouvel onglet
    window.open(url, '_blank');
  }
}
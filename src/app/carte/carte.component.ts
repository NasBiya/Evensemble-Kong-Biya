import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet'; // Import de Leaflet
import { FavorisService } from '../favoris.service'; // importer le service

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule], // Plus besoin de GoogleMapsModule
  templateUrl: './carte.component.html',
  styleUrl: './carte.component.css'
})
export class CarteComponent implements AfterViewInit { // On utilise AfterViewInit
  
  private map: any;
  //l'événement actuellement sélectionné
  selectedEvent: any = null;

  // une "Map" pour stocker les marqueurs Leaflet liés aux IDs des événements
  private markers: Map<number, L.Marker> = new Map();
  
  //données
  events = [
    {
      id: 1,
      title: 'Rock Concert',
      date: '24 Jan 2026',
      location: 'Le Mans',
      image: 'assets/hero.jpg',
      lat: 48.0061, 
      lng: 0.1996,
      description: 'Soirée Rock au Mans.'
    },
    {
      id: 2,
      title: 'Jazz Festival',
      date: '25 Jan 2026',
      location: 'Antarès',
      image: 'assets/hero.jpg',
      lat: 47.9570, 
      lng: 0.2220,
      description: 'Jazz à Antarès.'
    },
    {
      id: 2,
      title: 'Jazz Festival',
      date: '25 Jan 2026',
      location: 'Antarès',
      image: 'assets/hero.jpg',
      lat: 47.9570, 
      lng: 0.2220,
      description: 'Jazz à Antarès.'
    },
    {
      id: 2,
      title: 'Jazz Festival',
      date: '25 Jan 2026',
      location: 'Antarès',
      image: 'assets/hero.jpg',
      lat: 47.9570, 
      lng: 0.2220,
      description: 'Jazz à Antarès.'
    },
    {
      id: 2,
      title: 'Jazz Festival',
      date: '25 Jan 2026',
      location: 'Antarès',
      image: 'assets/hero.jpg',
      lat: 47.9570, 
      lng: 0.2220,
      description: 'Jazz à Antarès.'
    },
    {
      id: 2,
      title: 'Jazz Festival',
      date: '25 Jan 2026',
      location: 'Antarès',
      image: 'assets/hero.jpg',
      lat: 47.9570, 
      lng: 0.2220,
      description: 'Jazz à Antarès.'
    },
    {
      id: 2,
      title: 'Jazz Festival',
      date: '25 Jan 2026',
      location: 'Antarès',
      image: 'assets/hero.jpg',
      lat: 47.9570, 
      lng: 0.2220,
      description: 'Jazz à Antarès.'
    }
  ];

  // injecte de service
  constructor(public favorisService: FavorisService) {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    // Initialiser la carte centrée sur Le Mans
    this.map = L.map('map').setView([48.0061, 0.1996], 13);

    // Ajouter le fond de carte OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    // Ajouter les marqueurs
    this.addMarkers();
  }

  private addMarkers(): void {
    // Création d'une icône d'épingle sur la carte
    const myIcon = L.icon({
      iconUrl: 'assets/marker-icon.png',
      iconSize: [41, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    // Boucle sur les événements
    this.events.forEach(event => {
      const marker = L.marker([event.lat, event.lng], { icon: myIcon }).addTo(this.map);

      // Création du Popup HTML
      const popupContent = `
        <div style="width: 200px; text-align: center;">
          <div style="background-color: #ffc107; padding: 5px; border-radius: 5px 5px 0 0;">
             <h5 style="color: #dc3545; margin: 0; font-family: Impact;">MUSIC Festival</h5>
          </div>
          <div style="background-color: #008CBA; color: white; padding: 10px; border-radius: 0 0 5px 5px;">
             <h6 style="margin: 0; text-transform: uppercase; font-weight: bold;">${event.title}</h6>
             <p style="font-size: 12px; margin: 5px 0;">${event.date} à ${event.location}</p>
             <div style="display: flex; gap: 5px; justify-content: center; margin-top: 10px;">
                <button style="background: transparent; border: 1px solid white; color: white; border-radius: 10px; font-size: 10px; cursor: pointer;">LOGEMENT</button>
                <button style="background: transparent; border: 1px solid white; color: white; border-radius: 10px; font-size: 10px; cursor: pointer;">TRANSPORT</button>
             </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      this.markers.set(event.id, marker);
    });
  }

  // un des évenement cliqué
  onSelectEvent(event: any): void {
    this.selectedEvent = event;

    // Récupère le marqueur correspondant
    const marker = this.markers.get(event.id);

    if (marker) {
      // Déplace la carte vers l'événement avec une animation fluide
      this.map.flyTo([event.lat, event.lng], 13, {
        animate: true,
        duration: 1.5 // Vitesse de l'animation
      });

      // Ouvre le popup du marqueur
      marker.openPopup();
    }
  }

  onToggleFavori(event: any, mouseEvent: Event): void {
    mouseEvent.stopPropagation(); // Empêche la carte de bouger quand on clique juste sur l'étoile
    this.favorisService.toggleFavori(event);
  }
}
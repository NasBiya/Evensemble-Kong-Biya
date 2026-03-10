import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import * as L from 'leaflet';
import { FavorisService } from '../favoris.service';
import { EventService, GoogleEvent } from '../services/event.service';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './carte.component.html',
  styleUrl: './carte.component.css'
})
export class CarteComponent implements OnInit, AfterViewInit, OnDestroy {

  private map: any;
  selectedEvent: GoogleEvent | null = null;
  private markers: Map<string, L.Marker> = new Map();
  private searchSub!: Subscription;

  allEvents: GoogleEvent[] = [];
  events: GoogleEvent[] = [];

  loading = false;
  error: string | null = null;
  private mapReady = false;

  filterAujourdhui = false;
  filterDemain = false;
  filterDate = false;
  filterCustomDate = '';
  filterRating1_3 = false;
  filterRating3_5 = false;
  filterTout = true;

  private readonly MONTHS: Record<string, number> = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
  };

  constructor(
    public favorisService: FavorisService,
    private eventService: EventService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.searchSub = this.searchService.query$.subscribe(query => {
      this.loadEvents(query);
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.mapReady = true;
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
    if (this.map) this.map.remove();
  }

  // ── Data loading ──────────────────────────────────────────────────────────

  private loadEvents(query: string): void {
    this.loading = true;
    this.error = null;
    this.allEvents = [];
    this.events = [];
    this.clearMarkers();

    this.eventService.getEvents(query).subscribe({
      next: (data) => {
        this.allEvents = data.map((e, i) => ({
          ...e,
          id: e.id ?? `event-${e.title?.replace(/\s+/g, '-').toLowerCase()}-${i}`,
          displayDate: e.date?.when ?? e.date?.start_date ?? '',
          location: e.address?.join(', ') ?? '',
        }));
        this.applyFilters();
        this.loading = false;
        if (this.mapReady) {
          this.geocodeAndPlaceMarkers();
        }
      },
      error: (err) => {
        console.error('API error:', err);
        this.error = 'Impossible de charger les événements.';
        this.loading = false;
      }
    });
  }

  // ── Filters ───────────────────────────────────────────────────────────────

  applyFilters(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    this.events = this.allEvents.filter(event => {

      // ── Date filter ──────────────────────────────────────────────────────
      if (this.filterAujourdhui || this.filterDemain || (this.filterDate && this.filterCustomDate)) {
        const startDate = this.parseEventDate(event.displayDate ?? '');
        const endDate = this.parseEventEndDate(event.displayDate ?? '');
        if (!startDate) return false;

        startDate.setHours(0, 0, 0, 0);
        const effectiveEnd = endDate ?? new Date(startDate);
        effectiveEnd.setHours(0, 0, 0, 0);

        if (this.filterAujourdhui) {
          if (!(startDate <= today && effectiveEnd >= today)) return false;
        }

        if (this.filterDemain) {
          if (!(startDate <= tomorrow && effectiveEnd >= tomorrow)) return false;
        }

        if (this.filterDate && this.filterCustomDate) {
          const chosen = new Date(this.filterCustomDate);
          chosen.setHours(0, 0, 0, 0);
          if (!(startDate <= chosen && effectiveEnd >= chosen)) return false;
        }
      }

      // ── Rating filter ────────────────────────────────────────────────────
      if (!this.filterTout) {
        const rating = event.venue?.rating ?? null;
        if (this.filterRating1_3 && this.filterRating3_5) {
          // both = no filter
        } else if (this.filterRating1_3) {
          if (rating === null || rating < 1 || rating > 3) return false;
        } else if (this.filterRating3_5) {
          if (rating === null || rating < 3 || rating > 5) return false;
        }
      }

      return true;
    });

    // Refresh markers
    this.clearMarkers();
    this.events.forEach((event, index) => {
      if (event.lat != null && event.lng != null) {
        this.addMarker(event, index);
      }
    });
  }

  // ── Date parsing ──────────────────────────────────────────────────────────

  private parseEventDate(dateStr: string): Date | null {
    if (!dateStr) return null;
    const part = dateStr.split('–')[0].trim();
    return this.parseSerpDate(part);
  }

  private parseEventEndDate(dateStr: string): Date | null {
    if (!dateStr) return null;
    const parts = dateStr.split('–');
    if (parts.length < 2) return null;
    const endPart = parts[1].trim();
    if (!/[A-Za-z]{3,},/.test(endPart)) return null; 
    return this.parseSerpDate(endPart);
  }

  private parseSerpDate(part: string): Date | null {
    if (!part) return null;

    const match = part.match(/(?:[A-Za-z]+,\s+)?([A-Za-z]+)\s+(\d{1,2})/);
    if (!match) return null;

    const monthStr = match[1].toLowerCase().substring(0, 3);
    const day = parseInt(match[2], 10);
    const month = this.MONTHS[monthStr];

    if (month === undefined || isNaN(day)) return null;

    const year = new Date().getFullYear();
    const d = new Date(year, month, day);
    return isNaN(d.getTime()) ? null : d;
  }

  onDateFilterChange(filter: 'aujourdhui' | 'demain' | 'date'): void {
    this.filterAujourdhui = filter === 'aujourdhui' ? this.filterAujourdhui : false;
    this.filterDemain     = filter === 'demain'     ? this.filterDemain     : false;
    this.filterDate       = filter === 'date'       ? this.filterDate       : false;
    this.applyFilters();
  }

  onRatingFilterChange(): void {
    this.filterTout = !this.filterRating1_3 && !this.filterRating3_5;
    this.applyFilters();
  }

  onToutChange(): void {
    if (this.filterTout) {
      this.filterRating1_3 = false;
      this.filterRating3_5 = false;
    }
    this.applyFilters();
  }

  // ── Map ───────────────────────────────────────────────────────────────────

  private initMap(): void {
    this.map = L.map('map').setView([48.0061, 0.1996], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
  }

  private clearMarkers(): void {
    this.markers.forEach(m => m.remove());
    this.markers.clear();
  }

  private applyOffset(lat: number, lng: number, index: number): [number, number] {
    const offset = 0.0003;
    const angle = (index * 60) * (Math.PI / 180);
    return [lat + offset * Math.cos(angle), lng + offset * Math.sin(angle)];
  }

  private addMarker(event: GoogleEvent, index: number): void {
    if (event.lat == null || event.lng == null) return;

    let sameLocationCount = 0;
    this.markers.forEach((_, id) => {
      const existingEvent = this.events.find(e => e.id === id);
      if (existingEvent?.lat === event.lat && existingEvent?.lng === event.lng) {
        sameLocationCount++;
      }
    });

    const [lat, lng] = sameLocationCount > 0
      ? this.applyOffset(event.lat, event.lng, sameLocationCount)
      : [event.lat, event.lng];

    const myIcon = L.icon({
      iconUrl: 'assets/marker-icon.png',
      iconSize: [41, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    const marker = L.marker([lat, lng], { icon: myIcon }).addTo(this.map);

    const popupContent = `
      <div style="width: 200px; text-align: center;">

        <div style="background-color: #008CBA; color: white; padding: 10px; border-radius: 0 0 5px 5px;">
          <h6 style="margin: 0; text-transform: uppercase; font-weight: bold;">${event.title}</h6>
          <p style="font-size: 12px; margin: 5px 0;">${event.displayDate} · ${event.location}</p>
          <div style="display: flex; gap: 5px; justify-content: center; margin-top: 10px;">
            <button style="background: transparent; border: 1px solid white; color: white; border-radius: 10px; font-size: 10px; cursor: pointer;">LOGEMENT</button>
            <button style="background: transparent; border: 1px solid white; color: white; border-radius: 10px; font-size: 10px; cursor: pointer;">TRANSPORT</button>
          </div>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent);
    this.markers.set(event.id, marker);
  }

  private async geocodeAndPlaceMarkers(): Promise<void> {
    const addresses = this.allEvents
      .filter(e => e.address?.length && e.id)
      .map(e => ({ id: e.id!, address: e.address.join(', ') }));

    try {
      const res = await fetch('/api/geocode/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresses })
      });
      const results: { id: string, lat: string, lon: string }[] = await res.json();

      results.forEach((result, index) => {
        if (!result.lat || !result.lon) return;

        const allEvent = this.allEvents.find(e => e.id === result.id);
        if (allEvent) {
          allEvent.lat = parseFloat(result.lat);
          allEvent.lng = parseFloat(result.lon);
        }

        const event = this.events.find(e => e.id === result.id);
        if (event) {
          event.lat = parseFloat(result.lat);
          event.lng = parseFloat(result.lon);
          this.addMarker(event, index);
        }
      });
    } catch (err) {
      console.error('Bulk geocoding error:', err);
    }
  }

  onSelectEvent(event: GoogleEvent): void {
    this.selectedEvent = event;
    const marker = this.markers.get(event.id);
    if (marker && event.lat != null && event.lng != null) {
      this.map.flyTo([event.lat, event.lng], 15, { animate: true, duration: 1.5 });
      marker.openPopup();
    }
  }

  onToggleFavori(event: GoogleEvent, mouseEvent: Event): void {
    mouseEvent.stopPropagation();
    this.favorisService.toggleFavori(event);
  }
}
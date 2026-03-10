import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EventDate {
  start_date?: string;
  when?: string;
}

export interface EventVenue {
  name?: string;
  rating?: number;
  reviews?: number;
  link?: string;
}

export interface GoogleEvent {
  id: string;
  title: string;
  date: EventDate;
  address: string[];
  link: string;
  description?: string;
  thumbnail?: string;
  image?: string;
  venue?: EventVenue;
  ticket_info?: { source: string; link: string; link_type: string }[];
  // Computed after normalization
  displayDate?: string;
  location?: string;
  // Filled after geocoding
  lat?: number;
  lng?: number;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = '/api/events';

  constructor(private http: HttpClient) {}

  getEvents(query: string): Observable<GoogleEvent[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<GoogleEvent[]>(this.apiUrl, { params });
  }
}
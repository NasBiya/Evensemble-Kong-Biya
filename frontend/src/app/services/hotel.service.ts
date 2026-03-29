import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Accommodation {
  id: string; // property_token from SerpApi
  name: string;
  type: string;
  price: number;
  rating: number;
  imageUrl: string;
  amenities: string[];
  voir_prix: string;
  specs: {
    guests: string;
    bedrooms: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private apiUrl = '/api/hotels';

  constructor(private http: HttpClient) {}

  getHotels(city: string): Observable<Accommodation[]> {
    const params = new HttpParams()
      .set('city', city || 'Paris')
      .set('check_in', '2026-03-23')
      .set('check_out', '2026-03-28');

    return this.http.get<any[]>(this.apiUrl, { params }).pipe(
      map((data: any[]) => {
        return data.map(hotel => ({
          id: hotel.property_token,
          name: hotel.name,
          type: hotel.type,
          voir_prix: hotel.source  || '#',
          price: hotel.rate_per_night?.extracted_lowest || 0,
          rating: hotel.overall_rating || 0,
          imageUrl: hotel.images?.[0]?.thumbnail || hotel.images?.[0]?.original_image || 'assets/no_image.jpg',
          amenities: hotel.amenities || [],
          specs: {
            guests: hotel.essential_info?.find((s: string) => s.includes('Sleeps')) || 'Sleeps 2',
            bedrooms: hotel.essential_info?.find((s: string) => s.includes('bedrooms')) || '1 bedroom'
          }
        }));
      })
    );
  }
}
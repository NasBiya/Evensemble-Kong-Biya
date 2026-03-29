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
  essentialInfo: string[];
}

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private apiUrl = '/api/hotels';

  constructor(private http: HttpClient) {}

  getHotels(city: string, checkIn: string, checkOut: string): Observable<Accommodation[]> {
    const params = new HttpParams()
      .set('city', city || 'Paris')
      .set('check_in', checkIn)
      .set('check_out', checkOut);

    return this.http.get<any[]>(this.apiUrl, { params }).pipe(
      map((data: any[]) => {
        return data.map(hotel => {
          // Get essential info, preferring it over amenities, with amenities as fallback
          const essentialInfo = hotel.essential_info && hotel.essential_info.length > 0 
            ? hotel.essential_info 
            : (hotel.amenities && hotel.amenities.length > 0 ? hotel.amenities : []);
          
          // Generate pricing URL - use direct link if available, otherwise create Google Hotels search
          let pricingUrl = hotel.link || hotel.booking_url;
          if (!pricingUrl) {
            // Fallback: create a Google Hotels search URL
            const hotelName = encodeURIComponent(hotel.name || '');
            const cityName = encodeURIComponent(city || 'Paris');
            pricingUrl = `https://www.google.com/travel/search?q=${hotelName}+${cityName}`;
          }
          
          return {
            id: hotel.property_token,
            name: hotel.name,
            type: hotel.type,
            voir_prix: pricingUrl,
            price: hotel.rate_per_night?.extracted_lowest || 0,
            rating: hotel.overall_rating || 0,
            imageUrl: hotel.images?.[0]?.thumbnail || hotel.images?.[0]?.original_image || 'assets/no_image.jpg',
            amenities: hotel.amenities || [],
            essentialInfo: essentialInfo,
            specs: {
              guests: hotel.essential_info?.find((s: string) => s.includes('Sleeps')) || 'Sleeps 2',
              bedrooms: hotel.essential_info?.find((s: string) => s.includes('bedrooms')) || '1 bedroom'
            }
          };
        });
      })
    );
  }
}
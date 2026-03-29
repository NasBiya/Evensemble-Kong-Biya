import { Component, OnInit } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { HotelService, Accommodation } from '../services/hotel.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-hotel',
  standalone: true, // If you are using standalone components
  imports: [CommonModule], // 2. Add CommonModule to the imports array
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.css']
})
export class HotelComponent implements OnInit {
  // Your service uses the Accommodation interface
  hotels: Accommodation[] = [];
  private searchTerms = new Subject<string>();
  loading = false;

  constructor(private hotelService: HotelService) {}

  ngOnInit(): void {
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => {
        this.loading = true;
        return this.hotelService.getHotels(term);
      })
    ).subscribe({
      next: (data) => {
        this.hotels = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Search failed', err);
        this.loading = false;
      }
    });

    // Initial load
    this.search('');
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }
}
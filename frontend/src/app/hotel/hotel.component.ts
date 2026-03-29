import { Component, OnInit } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { HotelService, Accommodation } from '../services/hotel.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-hotel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.css']
})
export class HotelComponent implements OnInit {
  hotels: Accommodation[] = [];
  filteredHotels: Accommodation[] = [];
  loading = false;
  hasSearched = false;  // Track if search has been performed

  // Search parameters
  ville: string = 'Paris';
  checkIn: string = '';
  checkOut: string = '';

  // Filter properties
  filterTout = true;
  filterRating1_3 = false;
  filterRating3_5 = false;
  
  selectedMinPrice: number | null = null;
  selectedMaxPrice: number | null = null;

  constructor(
    private hotelService: HotelService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get the address from query params (if coming from carte)
    this.route.queryParams.subscribe(params => {
      if (params['ville']) {
        this.ville = params['ville'];
      }
    });
  }

  search(): void {
    // Validate both dates are entered
    if (!this.checkIn || !this.checkOut) {
      alert('Veuillez sélectionner les dates d\'arrivée et de départ');
      return;
    }

    // Only proceed if both dates are valid
    this.hasSearched = true;
    this.performSearch();
  }

  private performSearch(): void {
    this.loading = true;
    this.hotelService.getHotels(this.ville, this.checkIn, this.checkOut).subscribe({
      next: (data) => {
        this.hotels = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Search failed', err);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredHotels = this.hotels.filter(hotel => {
      // Price filter - check both minimum and maximum
      if (this.selectedMinPrice && hotel.price && hotel.price < this.selectedMinPrice) {
        return false;
      }
      if (this.selectedMaxPrice && hotel.price && hotel.price > this.selectedMaxPrice) {
        return false;
      }
      
      // Rating filter
      if (!this.filterTout) {
        if (this.filterRating1_3 && !(hotel.rating >= 1 && hotel.rating < 3)) {
          if (!this.filterRating3_5) return false;
        }
        if (this.filterRating3_5 && !(hotel.rating >= 3 && hotel.rating <= 5)) {
          if (!this.filterRating1_3) return false;
        }
      }
      
      return true;
    });
  }

  onToutChange(): void {
    if (this.filterTout) {
      this.filterRating1_3 = false;
      this.filterRating3_5 = false;
    }
    this.applyFilters();
  }

  onRatingFilterChange(): void {
    this.filterTout = false;
    this.applyFilters();
  }

  onPriceChange(): void {
    this.applyFilters();
  }
}
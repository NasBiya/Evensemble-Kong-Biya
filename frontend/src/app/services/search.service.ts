import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private querySubject = new BehaviorSubject<string>('Le Mans');
  query$ = this.querySubject.asObservable();

  setQuery(query: string): void {
    this.querySubject.next(query);
  }
}
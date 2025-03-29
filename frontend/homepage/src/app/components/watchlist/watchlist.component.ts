import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // for *ngIf, *ngFor
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { WatchlistService } from '../../services/watchlist.service';
import { Show } from '../../services/query-shows.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, MATERIAL_IMPORTS, ReactiveFormsModule, RouterModule, NavbarComponent],
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss']
})
export class WatchlistComponent implements OnInit {
  // We'll use a simple array to store the watchlist data
  watchlist: Show[] = [];
  ratings: number[] = [1,2,3,4,5,6,7,8,9,10];

  // Define a filter form (if you wish to filter the watchlist)
  filterForm: FormGroup;

  constructor(
    public watchlistService: WatchlistService,
    public router: Router, // change from private to public
    public fb: FormBuilder
  ) {
    // You can define filter controls if needed; otherwise, you may remove this form.
    this.filterForm = this.fb.group({
      titleContains: [''],
      genre: [''],
      // Add other filter controls as desired.
    });
  }

  ngOnInit(): void {
    // Subscribe to the watchlist observable to update our local watchlist array.
    this.watchlistService.watchlist$.subscribe((shows: Show[]) => {
      this.watchlist = shows;
    });
  }

  removeShow(show: Show): void {
    this.watchlistService.removeShow(show);
    console.log(`Removed "${show.title}" from watchlist.`);
  }

  updateUserRating(show: Show, event: any): void {
    show.userRating = event.value;
    // Optionally, update the service to persist changes.
  }

  goHome(): void {
    this.router.navigate(['']);
  }

  openShowList(): void {
    this.router.navigate(['shows']);
  }
    // New: Implement filtering actions
    onFilterApply(): void {
      const filters = this.filterForm.value;
      console.log('Filter applied:', filters);
      // Implement filtering logic as needed.
      // For example, you could filter the watchlist array or call a service method.
    }

    onFilterClear(): void {
      this.filterForm.reset();
      console.log('Filter cleared');
      // Optionally reset any filtered data here.
    }
}

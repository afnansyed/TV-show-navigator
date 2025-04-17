import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { ShowService, Show, ShowFilter } from '../../services/query-shows.service';
import { AuthService } from '../../services/auth.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-list',
  standalone: true,
  imports: [CommonModule, MATERIAL_IMPORTS, ReactiveFormsModule, MatSlideToggleModule, MatButtonModule, NavbarComponent],
  templateUrl: './show-list.component.html',
  styleUrls: ['./show-list.component.scss']
})
export class ShowListComponent implements OnInit {
  // Use a simple array for the card layout.
  shows: Show[] = [];
  dataLength = 0;

  // Form for filters remains the same.
  filterForm: FormGroup;

  constructor(
    private showService: ShowService,
    private fb: FormBuilder,
    private authService: AuthService, // Replace watchlistService with authService.
    private router: Router
  ) {
    this.filterForm = this.fb.group({
      titleContains: [''],
      isAdult: [''],
      genre: [''],
      startYearStart: [''],
      startYearEnd: [''],
      limit: ['']
    });
  }

  ngOnInit(): void {
    // Load shows with no filters initially.
    this.loadShows();
  }

  loadShows(filters?: ShowFilter): void {
    console.log('loadShows called with filters:', filters);
    this.showService.getShows(filters).subscribe({
      next: (data) => {
        console.log('Fetched shows:', data);
        this.shows = data;
        this.dataLength = data.length;
      },
      error: (err) => {
        console.error('Error fetching shows:', err);
      }
    });
  }

  onFilterApply(): void {
    const filters: ShowFilter = this.filterForm.value;
    this.loadShows(filters);
  }

  onFilterClear(): void {
    this.filterForm.reset();
    this.loadShows();
  }

  onCardClick(show: Show): void {
    // Navigate to the show details page
    this.router.navigate(['/show-details', show.tconst]);
  }

  /**
   * Toggle the watchlist state for a given show using the AuthService.
   */
  toggleWatchlist(event: any, show: Show): void {
    if (event.checked) {
      this.authService.addShowToWatchlist(show);
      console.log(`Added "${show.title}" to watchlist.`);
    } else {
      this.authService.removeShowFromWatchlist(show);
      console.log(`Removed "${show.title}" from watchlist.`);
    }
  }

  /**
   * Checks if a show is in the watchlist using the AuthService.
   */
  isInWatchlist(show: Show): boolean {
    return this.authService.isInWatchlist(show);
  }

  openWatchlist(): void {
    this.router.navigate(['/watchlist']);
  }

  goHome(): void {
    this.router.navigate(['']);
  }
}

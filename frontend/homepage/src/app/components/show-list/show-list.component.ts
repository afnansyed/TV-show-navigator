// src/app/components/show-list/show-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { ShowService, Show, ShowFilter } from '../../services/query-shows.service';
import { ProfileService } from '../../services/profileService.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-show-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatButtonModule,
    NavbarComponent,
    ...MATERIAL_IMPORTS
  ],
  templateUrl: './show-list.component.html',
  styleUrls: ['./show-list.component.scss']
})
export class ShowListComponent implements OnInit, OnDestroy {
  shows: Show[] = [];
  dataLength = 0;
  filterForm: FormGroup;
  private profileSubscription: Subscription | null = null;

  constructor(
    private showService: ShowService,
    private fb: FormBuilder,
    private profile: ProfileService,
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
    this.loadShows();

    // Subscribe to profile changes to trigger UI updates when watchlist changes
    this.profileSubscription = this.profile.profile$.subscribe({
      next: () => {
        // This will cause any UI elements using isInWatchlist to refresh
        // when the profile data changes
      },
      error: err => console.error('Error in profile subscription:', err)
    });
  }

  ngOnDestroy(): void {
    // Clean up subscription when component is destroyed
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }

  loadShows(filters?: ShowFilter): void {
    this.showService.getShows(filters).subscribe({
      next: data => {
        this.shows = data;
        this.dataLength = data.length;
      },
      error: err => console.error('Error fetching shows:', err)
    });
  }

  onFilterApply(): void {
    this.loadShows(this.filterForm.value as ShowFilter);
  }

  onFilterClear(): void {
    this.filterForm.reset();
    this.loadShows();
  }

  onCardClick(show: Show): void {
    this.router.navigate(['/show-details', show.tconst]);
  }

  toggleWatchlist(event: any, show: Show): void {
    const obs = event.checked
      ? this.profile.addToWatchlist(show.tconst)
      : this.profile.removeFromWatchlist(show.tconst);

    obs.subscribe({
      next: () => console.log(
        event.checked
          ? `Added "${show.title}" to watchlist.`
          : `Removed "${show.title}" from watchlist.`
      ),
      error: err => console.error('Error toggling watchlist:', err)
    });
  }

  isInWatchlist(show: Show): boolean {
    try {
      return this.profile.isInWatchlist(show.tconst);
    } catch (error) {
      console.error('Error checking watchlist status:', error);
      return false;
    }
  }

  openWatchlist(): void {
    this.router.navigate(['/watchlist']);
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}

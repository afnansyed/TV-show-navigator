import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { ShowService, Show } from '../../services/query-shows.service';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import {
  ProfileService,
  UserProfile,
  WatchlistItem,
  RatingItem,
  CommentItem
} from '../../services/profileService.service';
import { Subscription, forkJoin, of, Observable } from 'rxjs';
import { switchMap, tap, catchError, map } from 'rxjs/operators';

// Simplified show model for watchlist only
interface WatchlistShow {
  tconst: string;
  title: string;
  rating: number;
}

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [
    CommonModule,
    MATERIAL_IMPORTS,
    ReactiveFormsModule,
    RouterModule,
    NavbarComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss']
})
export class WatchlistComponent implements OnInit, OnDestroy {
  watchlist: WatchlistShow[] = [];
  filterForm: FormGroup;
  isLoading = true;

  /** profile stream */
  profile$: Observable<UserProfile | null>;
  /** latest snapshot */
  currentProfile: UserProfile | null = null;

  private sub!: Subscription;

  constructor(
    private profileService: ProfileService,
    private showService: ShowService,
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog
  ) {
    // assign profile$ after DI
    this.profile$ = this.profileService.profile$;

    // build filter form (unused but kept for layout)
    this.filterForm = this.fb.group({
      titleContains: [''],
      genre: ['']
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.sub = this.profile$
      .pipe(
        // stash a local copy of profile for helper methods
        tap(p => {
          console.log('Profile:', p);
          this.currentProfile = p;
        }),
        // switch to loading Show[] based on watchlist IDs
        switchMap(p => {
          const list: WatchlistItem[] = p?.watchlist ?? [];
          console.log('Watchlist items:', list);
          if (list.length === 0) {
            this.watchlist = [];
            this.isLoading = false;
            return of([] as WatchlistShow[]);
          }
          // build observables for each showID
          const calls = list.map(item => {
            console.log(`Fetching show for ID ${item.showID}`);
            return this.showService.getShowById(item.showID).pipe(
              tap(show => console.log(`✅ Fetched show for ID ${item.showID}:`, show)),
              catchError(err => {
                console.error(`Failed to fetch show ${item.showID}:`, err);
                return of({
                  tconst: item.showID,
                  title: 'Unknown Show',
                  rating: 0
                } as WatchlistShow);
              })
              // We'll map inside the subscribe instead
            );
          });
          return forkJoin(calls);
        }),
        catchError(err => {
          console.error('Error loading watchlist:', err);
          this.isLoading = false;
          return of([] as WatchlistShow[]);
        })
      )
      .subscribe(shows => {
        console.log('Final watchlist shows:', shows);
        // Map the Show objects to WatchlistShow objects
        this.watchlist = shows.map(show => ({
          tconst: show.tconst,
          title: show.title,
          rating: show.rating
        }));
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  goHome(): void {
    this.router.navigate(['']);
  }

  openShowList(): void {
    this.router.navigate(['shows']);
  }

  removeShow(show: WatchlistShow): void {
    if (confirm(`Remove "${show.title}" from your watchlist?`)) {
      this.profileService.removeFromWatchlist(show.tconst).subscribe(
        () => console.log(`Removed ${show.title} from watchlist`),
        error => console.error(`Error removing from watchlist:`, error)
      );
    }
  }

  /**
   * Set a new rating or delete an existing rating for a show
   * Uses the POST /ratings endpoint for adding (will replace existing)
   * or DELETE /ratings endpoint for removing
   */
  leaveOrEditRating(show: WatchlistShow): void {
    try {
      // Get current rating if exists
      const currentRating = this.getMyRating(show);
      const defaultVal = currentRating ? currentRating.toString() : '';

      const ans = prompt(`Rate "${show.title}" (1–10):`, defaultVal);

      // If user clicked cancel
      if (ans === null) return;

      // If user entered empty string and there was a previous rating, delete it
      if (ans === '' && currentRating !== null) {
        // Confirm deletion
        if (confirm('Remove your rating?')) {
          this.profileService.deleteRating(show.tconst).subscribe({
            next: () => {
              console.log(`Deleted rating for ${show.title}`);
              // Force UI update by refreshing the component
              this.refreshWatchlist();
              alert(`Your rating for "${show.title}" has been removed.`);
            },
            error: (error) => {
              console.error(`Error deleting rating:`, error);
              alert(`Failed to remove rating. Please try again.`);
            }
          });
        }
        return;
      }

      // Process valid rating
      const r = Number(ans);
      if (!isNaN(r) && r >= 1 && r <= 10) {
        // If there's an existing rating and it's different,
        // explain to the user that we'll replace it
        if (currentRating !== null && currentRating !== r) {
          if (!confirm(`Replace your current rating of ${currentRating} with ${r}?`)) {
            return;
          }
        }

        // Show loading indicator or disable buttons if needed
        console.log(`Attempting to set rating ${r} for ${show.title}...`);

        this.profileService.setRating(show.tconst, r).subscribe({
          next: () => {
            console.log(`Successfully set rating ${r} for ${show.title}`);

            // Update the current profile's ratings
            if (this.currentProfile && this.currentProfile.ratings) {
              // Find existing rating
              const existingRatingIndex = this.currentProfile.ratings.findIndex(
                rating => rating.showID === show.tconst
              );

              // Update or add the rating
              if (existingRatingIndex >= 0) {
                this.currentProfile.ratings[existingRatingIndex].rating = r;
              } else {
                this.currentProfile.ratings.push({
                  showID: show.tconst,
                  rating: r
                });
              }
            }

            // Force UI update by refreshing the component
            this.refreshWatchlist();

            alert(`You rated "${show.title}" ${r}/10!`);
          },
          error: (error) => {
            console.error(`Error setting rating:`, error);
            alert(`Failed to save rating. Please try again.`);
          }
        });
      } else if (ans !== '') {
        // Show error for invalid input
        alert('Please enter a valid rating between 1 and 10');
      }
    } catch (e) {
      console.error('Unexpected error in leaveOrEditRating:', e);
      alert('An unexpected error occurred. Please try again.');
    }
  }

  /**
   * Helper method to refresh the watchlist after changes
   */
  refreshWatchlist(): void {
    // Set loading state
    this.isLoading = true;

    // Re-fetch the profile and watchlist data
    if (this.sub) {
      this.sub.unsubscribe();
    }

    this.ngOnInit();
  }

  /**
   * Add a new comment or delete an existing comment for a show
   * Uses the POST /comments endpoint for adding
   * (API doesn't support updates, so we'll delete and re-add)
   */
  leaveOrEditComment(show: WatchlistShow): void {
    const currentComment = this.getMyComment(show);
    const defaultVal = currentComment || '';

    const c = prompt(`Comment on "${show.title}":`, defaultVal);

    // If user clicked cancel
    if (c === null) return;

    // If empty string and there was a comment, find if we need to delete it
    if (c === '' && currentComment !== null) {
      // Find the comment ID
      const commentObj = this.findCommentObject(show.tconst);
      if (commentObj && commentObj.commentID) {
        if (confirm('Delete your comment?')) {
          this.profileService.deleteComment(commentObj.commentID).subscribe(
            () => console.log(`Deleted comment for ${show.title}`),
            error => console.error(`Error deleting comment:`, error)
          );
        }
      }
      return;
    }

    // Handle edit (delete and re-add since API doesn't support updates)
    if (c && c.trim() && currentComment !== null && c.trim() !== currentComment) {
      if (confirm('Replace your current comment with this new one?')) {
        // First find and delete the existing comment
        const commentObj = this.findCommentObject(show.tconst);
        if (commentObj && commentObj.commentID) {
          // We need to delete first, then add the new one
          this.profileService.deleteComment(commentObj.commentID).subscribe(
            () => {
              // After successful deletion, add the new comment
              this.profileService.addComment(show.tconst, c.trim()).subscribe(
                () => console.log(`Updated comment for ${show.title}`),
                error => console.error(`Error adding new comment:`, error)
              );
            },
            error => console.error(`Error deleting old comment:`, error)
          );
        }
      }
      return;
    }

    // Add new comment when there's no existing one
    if (c && c.trim() && currentComment === null) {
      this.profileService.addComment(show.tconst, c.trim()).subscribe(
        () => console.log(`Added comment for ${show.title}`),
        error => console.error(`Error adding comment:`, error)
      );
    }
  }

  /**
   * Get the user's rating for a show
   * Used to display and pre-fill the rating dialog
   */
  getMyRating(show: WatchlistShow): number | null {
    const list = this.currentProfile?.ratings;
    if (!list) return null;
    const it = list.find((r: RatingItem) => r.showID === show.tconst);
    return it ? it.rating : null;
  }

  /**
   * Get the user's comment for a show
   * Used to display and pre-fill the comment dialog
   */
  getMyComment(show: WatchlistShow): string | null {
    const list = this.currentProfile?.comments;
    if (!list) return null;
    const it = list.find((c: CommentItem) => c.showID === show.tconst);
    return it ? it.comment : null;
  }

  /**
   * Helper to find the full comment object including ID for deletion
   */
  private findCommentObject(showID: string): CommentItem | null {
    const list = this.currentProfile?.comments;
    if (!list) return null;
    return list.find((c: CommentItem) => c.showID === showID) || null;
  }

  onFilterApply(): void {
    // client-side filtering (optional)
    const filters = this.filterForm.value;
    if (!filters.titleContains) {
      return;
    }

    // This is a basic client-side filter implementation
    // Note: We're only filtering by title now since we don't have genre
    this.watchlist = this.watchlist.filter(show => {
      const matchesTitle = !filters.titleContains ||
                           show.title.toLowerCase().includes(filters.titleContains.toLowerCase());
      return matchesTitle;
    });
  }

  onFilterClear(): void {
    this.filterForm.reset();
    // Reload the complete watchlist when filters are cleared
    this.ngOnInit();
  }
}

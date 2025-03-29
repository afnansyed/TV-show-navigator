import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // For *ngIf, *ngFor
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { Show } from '../../services/query-shows.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService, UserProfile } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, MATERIAL_IMPORTS, ReactiveFormsModule, RouterModule, NavbarComponent],
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss']
})
export class WatchlistComponent implements OnInit {
  watchlist: Show[] = [];
  ratings: number[] = [1,2,3,4,5,6,7,8,9,10];
  filterForm: FormGroup;

  // Expose the user profile observable from AuthService.
  public userProfile$: Observable<UserProfile | null>;

  constructor(
    public authService: AuthService,
    public router: Router,
    public fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      titleContains: [''],
      genre: ['']
    });
    this.userProfile$ = this.authService.userProfile$;
  }

  ngOnInit(): void {
    // Subscribe to the user profile and extract the watchlist.
    this.authService.userProfile$.subscribe((profile: UserProfile | null) => {
      this.watchlist = profile ? profile.watchlist : [];
    });
  }

  removeShow(show: Show): void {
    this.authService.removeShowFromWatchlist(show);
    console.log(`Removed "${show.title}" from watchlist.`);
  }

  updateUserRating(show: Show, event: any): void {
    this.authService.rateShow(show, event.value);
  }

  leaveComment(show: Show, event: any): void {
    event.stopPropagation();
    const comment = prompt(`Leave a comment for "${show.title}":`);
    if (comment && comment.trim().length > 0) {
      this.authService.addComment(show, comment);
      console.log(`Added comment to "${show.title}": ${comment}`);
    }
  }

  editComment(show: Show, event: any): void {
    event.stopPropagation();
    let existingComment = '';
    const profile = this.authService.userProfileSubject.value; // Ideally expose a getter
    if (profile && profile.comments[show.tconst] && profile.comments[show.tconst].length > 0) {
      existingComment = profile.comments[show.tconst][0];
    }
    const comment = prompt(`Edit comment for "${show.title}":`, existingComment);
    if (comment !== null && comment.trim().length > 0) {
      // Use setComment method if available; otherwise, we call addComment which can append.
      // Here we'll assume addComment replaces the comment (or you can implement a separate setComment).
      this.authService.addComment(show, comment);
      console.log(`Updated comment for "${show.title}" to: ${comment}`);
    }
  }

  // New: Method to handle leaving or editing a rating.
  leaveOrEditRating(show: Show, event: any): void {
    event.stopPropagation();
    // Retrieve existing rating if available.
    const profile = this.authService.userProfileSubject.value; // Ideally expose a getter instead
    let existingRating: number | undefined = profile ? profile.ratings[show.tconst] : undefined;
    const promptText = existingRating !== undefined ? `Edit rating for "${show.title}" (1-10):` : `Leave rating for "${show.title}" (1-10):`;
    const input = prompt(promptText, existingRating ? existingRating.toString() : '');
    if (input !== null) {
      const rating = parseInt(input, 10);
      if (!isNaN(rating) && rating >= 1 && rating <= 10) {
        this.authService.rateShow(show, rating);
        console.log(`Updated rating for "${show.title}" to: ${rating}`);
      } else {
        alert('Please enter a valid rating between 1 and 10.');
      }
    }
  }

  goHome(): void {
    this.router.navigate(['']);
  }

  openShowList(): void {
    this.router.navigate(['shows']);
  }

  onFilterApply(): void {
    const filters = this.filterForm.value;
    console.log('Filter applied:', filters);
    // Implement filtering logic as needed.
  }

  onFilterClear(): void {
    this.filterForm.reset();
    console.log('Filter cleared');
  }

  // Expose a public method to check if a show is in the watchlist.
  isShowInWatchlist(show: Show): boolean {
    return this.authService.isInWatchlist(show);
  }
}

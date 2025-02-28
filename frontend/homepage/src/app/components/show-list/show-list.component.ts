import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { ShowService, Show, ShowFilter } from '../../services/query-shows.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { WatchlistService } from '../../services/watchlist.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-list',
  standalone: true,
  // Add MatSlideToggleModule and MatButtonModule to the imports array
  imports: [MATERIAL_IMPORTS, ReactiveFormsModule, MatSlideToggleModule, MatButtonModule],
  templateUrl: './show-list.component.html',
  styleUrls: ['./show-list.component.css']
})
export class ShowListComponent implements OnInit, AfterViewInit {
  // Table columns: Title, Rating, Genre, Runtime Minutes, and Actions (toggle)
  displayedColumns: string[] = ['title', 'rating', 'genre', 'runtimeMinutes', 'actions'];
  dataSource = new MatTableDataSource<Show>([]);
  dataLength = 0;

  // Form for filters (if you use it)
  filterForm: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private showService: ShowService,
    private fb: FormBuilder,
    private watchlistService: WatchlistService,
    private router: Router
  ) {
    this.filterForm = this.fb.group({
      titleContains: [''],
      isAdult: [''],         // Expect "TRUE" or "FALSE"
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

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  loadShows(filters?: ShowFilter): void {
    this.showService.getShows(filters).subscribe({
      next: (data) => {
        console.log('Fetched shows:', data);
        this.dataSource.data = data;
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

  /**
   * Toggle the watchlist state for a given show.
   * When the slide toggle changes, add or remove the show from the watchlist.
   */
  toggleWatchlist(event: any, show: Show): void {
    if (event.checked) {
      this.watchlistService.addShow(show);
      console.log(`Added "${show.title}" to watchlist.`);
    } else {
      this.watchlistService.removeShow(show);
      console.log(`Removed "${show.title}" from watchlist.`);
    }
  }

  /**
   * Helper method used in the template to determine if a show is in the watchlist.
   */
  isInWatchlist(show: Show): boolean {
    return this.watchlistService.isInWatchlist(show);
  }

  /**
   * Navigates to the watchlist page.
   */
  openWatchlist(): void {
    this.router.navigate(['/watchlist']);
  }

  goHome(): void {
    this.router.navigate(['']);
  }
}

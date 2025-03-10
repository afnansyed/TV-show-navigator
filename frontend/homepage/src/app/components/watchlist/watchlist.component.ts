// watchlist.component.ts
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { WatchlistService } from '../../services/watchlist.service';
import { Show } from '../../services/query-shows.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [MATERIAL_IMPORTS, RouterModule],
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss']
})
export class WatchlistComponent implements OnInit, AfterViewInit {
  // Add 'userRating' to the displayed columns
  displayedColumns: string[] = ['title', 'rating', 'genre', 'runtimeMinutes', 'userRating', 'actions'];
  dataSource = new MatTableDataSource<Show>([]);

  // List of valid ratings (1 to 10)
  ratings: number[] = [1,2,3,4,5,6,7,8,9,10];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private watchlistService: WatchlistService, private router: Router) {}

  ngOnInit(): void {
    // Subscribe to the watchlist observable so that any changes update the dataSource
    this.watchlistService.watchlist$.subscribe((shows: Show[]) => {
      this.dataSource.data = shows;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  removeShow(show: Show): void {
    this.watchlistService.removeShow(show);
    console.log(`Removed "${show.title}" from watchlist.`);
  }

  goHome(): void {
    this.router.navigate(['']);
  }

  openShowList(): void {
    this.router.navigate(['shows']);
  }

  updateUserRating(show: Show, event: any): void {
    show.userRating = event.value;
    // Optionally, update the watchlistService if you need persistence.
  }

}

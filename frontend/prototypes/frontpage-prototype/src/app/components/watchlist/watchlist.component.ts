// watchlist.component.ts
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { WatchlistService } from '../../services/watchlist.service';
import { Show } from '../../services/query-shows.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [MATERIAL_IMPORTS],
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['title', 'rating', 'genre', 'runtimeMinutes', 'actions'];
  dataSource = new MatTableDataSource<Show>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private watchlistService: WatchlistService) {}

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
}

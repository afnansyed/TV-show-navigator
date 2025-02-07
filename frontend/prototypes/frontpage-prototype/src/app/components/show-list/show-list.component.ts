import { Component, OnInit, ViewChild } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { ShowService, Show } from '../../services/query-shows.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-show-list',
  standalone: true,
  imports: [ MATERIAL_IMPORTS ],
  templateUrl: './show-list.component.html',
  styleUrls: ['./show-list.component.css']
})
export class ShowListComponent implements OnInit {
  displayedColumns: string[] = ['Title', 'tconst']; // Updated column names
  dataSource = new MatTableDataSource<Show>([]);
  dataLength = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private showService: ShowService) {}

  ngOnInit(): void {
    this.showService.getShows().subscribe({
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

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}

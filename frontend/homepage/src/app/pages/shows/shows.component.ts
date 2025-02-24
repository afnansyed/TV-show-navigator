import { Component } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { ShowListComponent } from "../../components/show-list/show-list.component";

@Component({
  selector: 'app-shows',
  imports: [MATERIAL_IMPORTS, ShowListComponent],
  templateUrl: './shows.component.html',
  styleUrl: './shows.component.scss'
})
export class ShowsComponent {

}

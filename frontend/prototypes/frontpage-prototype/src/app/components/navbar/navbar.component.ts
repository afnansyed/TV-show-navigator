import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MATERIAL_IMPORTS } from '../../material.imports';


@Component({
  selector: 'app-navbar',
  imports: [RouterModule, ...MATERIAL_IMPORTS],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  
}

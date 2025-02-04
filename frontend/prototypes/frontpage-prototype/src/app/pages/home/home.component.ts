import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { FeaturesComponent } from '../../components/features/features.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ShowsComponent } from "../shows/shows.component";

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, CommonModule, MATERIAL_IMPORTS, FeaturesComponent, HeroComponent, NavbarComponent, ShowsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',

})

export class HomeComponent {

}

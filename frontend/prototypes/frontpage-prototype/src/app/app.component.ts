import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MATERIAL_IMPORTS } from './material.imports';
import { FeaturesComponent } from './components/features/features.component';
import { HeroComponent } from './components/hero/hero.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ShowsComponent } from "./pages/shows/shows.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MATERIAL_IMPORTS, FeaturesComponent, HeroComponent, NavbarComponent, ShowsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'front-end-prototype';
}

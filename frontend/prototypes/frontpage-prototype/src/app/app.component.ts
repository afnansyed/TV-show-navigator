import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MATERIAL_IMPORTS } from './material.imports';
import { FeaturesComponent } from './components/features/features.component';
import { HeroComponent } from './components/hero/hero.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ShowsComponent } from "./pages/shows/shows.component";

@Component({
  selector: 'app-root',
<<<<<<< HEAD
  imports: [RouterOutlet, MATERIAL_IMPORTS, FeaturesComponent, HeroComponent, NavbarComponent, ShowsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
=======
  imports: [RouterOutlet],
  //imports: [RouterOutlet, MATERIAL_IMPORTS, FeaturesComponent, HeroComponent, NavbarComponent],
//  templateUrl: './app.component.html',
 // styleUrl: './app.component.scss',
  template: `
    
    <router-outlet></router-outlet>
    `

>>>>>>> e296d3f5365ade197f97665a8752e4432a9b9dc9
})
export class AppComponent {
  title = 'front-end-prototype';
}



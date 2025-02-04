import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { FeaturesComponent } from '../../components/features/features.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, CommonModule, MATERIAL_IMPORTS, FeaturesComponent, HeroComponent, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  template: `

  <router-outlet></router-outlet>
  `

})

export class HomeComponent {

}

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MATERIAL_IMPORTS } from '../../material.imports';

@Component({
  selector: 'app-hero',
  imports: [RouterModule, ...MATERIAL_IMPORTS],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {

}

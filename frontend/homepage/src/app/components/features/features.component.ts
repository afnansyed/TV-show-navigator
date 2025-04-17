import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MATERIAL_IMPORTS } from '../../material.imports';

@Component({
  selector: 'app-features',
  imports: [RouterModule,MATERIAL_IMPORTS],
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss'
})
export class FeaturesComponent {

}

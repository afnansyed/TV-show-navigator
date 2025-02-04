import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MATERIAL_IMPORTS } from './material.imports';
import { HomeComponent } from "./pages/home/home.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MATERIAL_IMPORTS, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'


})
export class AppComponent {
  title = 'front-end-prototype';
}



// src/app/components/navbar/navbar.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { AuthenticationService, User } from '../../services/authentication.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ...MATERIAL_IMPORTS],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  /** Emits the current user or null */
  currentUser$: Observable<User | null>;

  constructor(private auth: AuthenticationService) {
    this.currentUser$ = this.auth.currentUser$;
  }

  logout() {
    this.auth.logout();
  }
}

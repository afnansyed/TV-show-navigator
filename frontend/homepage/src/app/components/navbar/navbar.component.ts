import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { AuthService, UserProfile } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ...MATERIAL_IMPORTS],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  userProfile$: Observable<UserProfile | null>;
  isLoggedIn$: Observable<boolean>;

  constructor(private authService: AuthService) {
    this.userProfile$ = this.authService.userProfile$;
    this.isLoggedIn$ = this.authService.loggedIn$;
  }

  logout(): void {
    this.authService.logout();
  }
}

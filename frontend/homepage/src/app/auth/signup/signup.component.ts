// src/app/auth/signup/signup.component.ts
import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ...MATERIAL_IMPORTS],
})
export class SignupComponent {
  username = '';
  password = '';
  errorMess = '';

  constructor(
    private auth: AuthenticationService,
    private router: Router
  ) {}

  onSubmit() {
    this.auth.signUp(this.username, this.password).subscribe({
      next: user => {
        console.log('Signed up & logged in as', user);
        // now navigate somewhere you actually have a route for:
        this.router.navigate(['/home']);
      },
      error: err => {
        console.error('Sign‑up failed', err);
        this.errorMess = 'Could not sign you up';
      }
    });
  }
}

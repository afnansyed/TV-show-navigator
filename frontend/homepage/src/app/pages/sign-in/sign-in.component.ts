// src/app/pages/sign-in/sign-in.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ...MATERIAL_IMPORTS
  ],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  username = '';
  password = '';
  errorMess = '';

  constructor(
    private auth: AuthenticationService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.auth.signIn(this.username, this.password).subscribe({
      next: (success: boolean) => {
        if (success) {
          this.router.navigate(['/home']);
        } else {
          this.errorMess = 'Invalid credentials';
        }
      },
      error: err => {
        this.errorMess = 'Error signing in';
        console.error(err);
      }
    });
  }
}

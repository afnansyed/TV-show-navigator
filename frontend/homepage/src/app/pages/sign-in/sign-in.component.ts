import { Component } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  imports: [CommonModule, RouterModule, ...MATERIAL_IMPORTS, FormsModule],
  standalone: true
})
export class SignInComponent {
  username: string = '';
  password: string = '';
  errorMess: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: (success: boolean) => {
        if (success) {
          // Navigate to a dashboard or home page on successful sign-in.
          this.router.navigate(['/home']);
        } else {
          this.errorMess = 'Invalid credentials';
        }
      },
      error: (err) => {
        this.errorMess = 'Error signing in';
        console.error('Error signing in:', err);
      }
    });
  }
}

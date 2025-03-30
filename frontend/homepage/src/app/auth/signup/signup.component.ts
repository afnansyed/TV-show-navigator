import { Component } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';  // Use the AuthService instead of SignupService
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],  // Correct property name is styleUrls
  imports: [CommonModule, MATERIAL_IMPORTS, FormsModule],
  standalone: true
})
export class SignupComponent {
  username: string = '';
  password: string = '';
  errorMess: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    // Call login() to simulate sign-up (in our mock, login creates a new profile)
    this.authService.login(this.username, this.password).subscribe({
      next: (success) => {
        if (success) {
          console.log('Account created successfully');
          // Navigate to a dashboard or home page after successful sign-up
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMess = 'Could not create account';
        }
      },
      error: (err) => {
        this.errorMess = 'Error creating account';
        console.error('Error:', err);
      }
    });
  }
}

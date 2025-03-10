import { Component } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignupService, UserValidationResponse } from '../../services/signup.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  imports: [CommonModule, MATERIAL_IMPORTS, FormsModule],
  standalone: true
})
export class SignInComponent {
  username: string = '';
  password: string = '';
  errorMess: string = '';

  constructor(private signupService: SignupService, private router: Router) {}

  onSubmit() {
    this.signupService.signIn(this.username, this.password)
      .subscribe({
        next: (response: UserValidationResponse) => {
          console.log('User validated, ROWID:', response.rowid);
          // Navigate or update state as needed
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMess = 'Invalid credentials or server error';
          console.error('Error validating user', error);
        }
      });
  }
}
